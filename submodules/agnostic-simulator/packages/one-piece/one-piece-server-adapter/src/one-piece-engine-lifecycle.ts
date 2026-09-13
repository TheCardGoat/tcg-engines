import { getCard, hasCard } from "@tcg/op-cards";
import { createMatch } from "@tcg/op-engine";
import type { MatchConfig, MatchSeat, MatchState } from "@tcg/op-engine";
import { groupInstancesBySection, type CardsMaps } from "@tcg/shared/game-adapter";
import type {
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import { OnePieceServerEngine } from "./one-piece-server-engine";

const SEAT_ORDER: MatchSeat[] = ["south", "north"];
const ONE_PIECE_KNOWN_SECTIONS: ReadonlySet<string> = new Set(["leader", "main", "don"]);

interface ClassifiedDeck {
  leaderId: string | undefined;
  mainDeck: string[];
  donDeckCount: number;
  /**
   * Instances that could not be routed to a section (only populated by the
   * section-driven path). The legacy fallback preserves its prior fail-open
   * behavior and leaves this undefined.
   */
  unresolved?: readonly { instanceId: string; definitionId?: string }[];
}

/**
 * Split a flat per-owner instance list into leader / main / DON!! buckets.
 *
 * Prefers the deck builder's section tag ({@link CardsMaps.instanceSections})
 * for the DON!! deck so the engine does not count DON!! by catalog type.
 * V2 routes the leader, main deck, and DON!! deck through distinct registered
 * sections. When `instanceSections` is absent (legacy snapshots and old
 * practice links), full catalog-type classification remains the read fallback.
 */
function classifyCards(instanceIds: string[], cardsMaps: CardsMaps): ClassifiedDeck {
  if (cardsMaps.instanceSections) {
    return classifyBySection(instanceIds, cardsMaps);
  }
  return classifyByLegacyType(instanceIds, cardsMaps);
}

function classifyBySection(instanceIds: string[], cardsMaps: CardsMaps): ClassifiedDeck {
  const { bySection, unresolved } = groupInstancesBySection(instanceIds, cardsMaps, {
    knownSections: ONE_PIECE_KNOWN_SECTIONS,
  });
  const donDeckCount = bySection.get("don")?.length ?? 0;
  const leaderId = bySection.get("leader")?.[0]?.definitionId;
  const mainDeck = (bySection.get("main") ?? []).map((entry) => entry.definitionId);
  // Report the actual DON!! count — do NOT default to 10 on the section-driven
  // path. An empty "don" bucket means DON!! cards were mis-tagged or missing,
  // and the unresolved check (or downstream validation) must surface that
  // rather than silently inventing 10 cards.
  return { leaderId, mainDeck, donDeckCount, unresolved };
}

function classifyByLegacyType(instanceIds: string[], cardsMaps: CardsMaps): ClassifiedDeck {
  let leaderId: string | undefined;
  const mainDeck: string[] = [];
  let donCount = 0;

  for (const instanceId of instanceIds) {
    const cardId = cardsMaps.cardInstances[instanceId];
    if (!cardId) continue;
    if (!hasCard(cardId)) {
      mainDeck.push(cardId);
      continue;
    }
    const card = getCard(cardId);
    if (card.cardType === "leader") {
      leaderId = cardId;
    } else if (card.cardType === "don") {
      donCount++;
    } else {
      mainDeck.push(cardId);
    }
  }

  return { leaderId, mainDeck, donDeckCount: donCount > 0 ? donCount : 10 };
}

export async function onePieceCreateServerEngine(
  input: ServerEngineCreateInput,
): Promise<ServerGameEngine> {
  if (input.timeControl && input.timeControl.mode !== "none") {
    throw new Error(
      `One Piece adapter does not support time-control mode "${input.timeControl.mode}". ` +
        `Only "none" is currently implemented.`,
    );
  }

  const playerIds = [input.player1Id, input.player2Id];
  const players: Record<MatchSeat, MatchConfig["players"][MatchSeat]> = {
    south: { leaderCardId: "", mainDeck: [], playerName: input.player1Id },
    north: { leaderCardId: "", mainDeck: [], playerName: input.player2Id },
  };

  for (let i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    const seat = SEAT_ORDER[i];
    const instanceIds = input.cardsMaps.owners[playerId] ?? [];
    const { leaderId, mainDeck, donDeckCount, unresolved } = classifyCards(
      instanceIds,
      input.cardsMaps,
    );

    if (unresolved && unresolved.length > 0) {
      throw new Error(
        `One Piece match setup for ${playerId} received ${unresolved.length} instance(s) ` +
          `without a resolvable deck section: ${unresolved
            .map((entry) => entry.definitionId ?? entry.instanceId)
            .join(", ")}. ` +
          `The deck builder must tag every card with a section (leader/main/don).`,
      );
    }

    if (!leaderId) {
      throw new Error(`One Piece deck for ${playerId} does not contain a leader card.`);
    }

    players[seat] = {
      leaderCardId: leaderId,
      mainDeck,
      playerName: playerId,
      donDeckCount,
    };
  }

  const firstPlayer: MatchSeat = input.firstPlayerChooserId === input.player2Id ? "north" : "south";

  const config: MatchConfig = {
    firstPlayer,
    players,
    seed: input.seed,
    shuffleDecks: true,
    skipFirstTurnDraw: false,
    openingHandSize: 5,
    maxCharacterSlots: 5,
    judgeFallback: true,
  };

  const state = createMatch(config);
  return new OnePieceServerEngine(state, {
    [input.player1Id]: "south",
    [input.player2Id]: "north",
  });
}

export function onePieceSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const onePiece = unwrap(engine);
  return {
    gameSlug: "one-piece",
    state: {
      ...onePiece.state,
      ctx: { stateID: onePiece.state.idCounter },
    },
    historyLength: 0,
    cardsMaps,
  };
}

export async function onePieceRestoreEngine(
  snapshot: EngineSnapshot,
  _context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const state = snapshot.state as MatchState;
  const playerIdToSeat: Record<string, MatchSeat> = {};
  for (const seat of SEAT_ORDER) {
    const player = state.players[seat];
    if (player) {
      // Snapshots written before turnsStarted existed leave the field undefined.
      // canAttackWith rejects non-numeric values as first-turn bans, but also
      // beginTurn must not NaN-increment; normalize here at restore time.
      if (typeof player.turnsStarted !== "number" || Number.isNaN(player.turnsStarted)) {
        player.turnsStarted = 0;
      }
      playerIdToSeat[player.playerName] = seat;
    }
  }
  return new OnePieceServerEngine(state, playerIdToSeat);
}

export function onePieceExtractCardsMapsFromSnapshot(snapshot: EngineSnapshot): CardsMaps {
  return snapshot.cardsMaps ?? { cardInstances: {}, owners: {} };
}

function unwrap(engine: ServerGameEngine): OnePieceServerEngine {
  if (engine instanceof OnePieceServerEngine) return engine;
  throw new Error(
    "One Piece adapter received a ServerGameEngine that is not a OnePieceServerEngine. " +
      "This indicates a wiring bug in the game-server.",
  );
}
