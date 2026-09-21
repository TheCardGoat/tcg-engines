import { createInitialState } from "@tcg/alpha-clash-engine";
import type { CreateMatchOptions, MatchState, PlayerId } from "@tcg/alpha-clash-engine";
import { getCard } from "@tcg/alpha-clash-cards";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type {
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const SEAT_ORDER: readonly PlayerId[] = ["player-one", "player-two"];

/** The deck section holding the Contender (rule 100.2a); everything else is main. */
export const ALPHA_CLASH_CONTENDER_SECTION_ID = "contender";
export const ALPHA_CLASH_MAIN_SECTION_ID = "main";

interface ClassifiedDeck {
  contenderId: string | undefined;
  mainDeck: string[];
}

/**
 * Split a flat per-owner instance list into the Contender and the 50-card
 * main deck. Prefers the deck builder's section tag
 * ({@link CardsMaps.instanceSections}); falls back to catalog card type for
 * legacy snapshots that never carried sections.
 */
function classifyDeck(instanceIds: readonly string[], cardsMaps: CardsMaps): ClassifiedDeck {
  let contenderId: string | undefined;
  const sectionMain: string[] = [];
  const typeMain: string[] = [];
  let sawSections = false;

  for (const instanceId of instanceIds) {
    const cardId = cardsMaps.cardInstances[instanceId];
    if (!cardId) continue;
    const section = cardsMaps.instanceSections?.[instanceId];
    const card = getCard(cardId);
    if (section) {
      sawSections = true;
      if (section === ALPHA_CLASH_CONTENDER_SECTION_ID) {
        contenderId ??= cardId;
        continue;
      }
      sectionMain.push(cardId);
    } else if (card.cardType === "contender") {
      contenderId ??= cardId;
    } else {
      typeMain.push(cardId);
    }
  }

  return { contenderId, mainDeck: sawSections ? sectionMain : typeMain };
}

export async function alphaClashCreateServerEngine(
  input: ServerEngineCreateInput,
): Promise<ServerGameEngine> {
  if (input.timeControl && input.timeControl.mode !== "none") {
    throw new Error(
      `Alpha Clash adapter does not support time-control mode "${input.timeControl.mode}". ` +
        `Only "none" is currently implemented.`,
    );
  }

  const playerIds = [input.player1Id, input.player2Id];
  const players: CreateMatchOptions["players"] = {
    "player-one": { name: input.player1Id, deck: { contenderId: "", deckIds: [] } },
    "player-two": { name: input.player2Id, deck: { contenderId: "", deckIds: [] } },
  };

  for (let index = 0; index < playerIds.length; index++) {
    const playerId = playerIds[index];
    const seat = SEAT_ORDER[index];
    const instanceIds = input.cardsMaps.owners[playerId] ?? [];
    const { contenderId, mainDeck } = classifyDeck(instanceIds, input.cardsMaps);
    if (!contenderId) {
      throw new Error(`Alpha Clash deck for ${playerId} does not contain a Contender card.`);
    }
    players[seat] = { name: playerId, deck: { contenderId, deckIds: mainDeck } };
  }

  const options: CreateMatchOptions = {
    id: input.matchID ?? input.gameID ?? `alpha-clash-${crypto.randomUUID()}`,
    ...(input.seed !== undefined ? { seed: numericSeed(input.seed) } : {}),
    ...(input.firstPlayerChooserId
      ? {
          firstPlayer:
            input.firstPlayerChooserId === input.player2Id
              ? "player-two"
              : ("player-one" as PlayerId),
        }
      : {}),
    players,
    validateDeck: true,
  };

  const state = createInitialState(options);
  return new AlphaClashServerEngine(state, {
    [input.player1Id]: "player-one",
    [input.player2Id]: "player-two",
  });
}

export function alphaClashSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const alphaClash = unwrap(engine);
  const state = structuredClone(alphaClash.state) as unknown as MatchState;
  return {
    gameSlug: "alpha-clash",
    // Platform persistence derives the CAS version from the snapshot itself
    // (stateVersionFromSnapshot); the raw MatchState carries no version, so
    // the engine's moveLog-count version is embedded here (naruto pattern).
    state: { ...state, stateVersion: alphaClash.getStateID() },
    historyLength: alphaClash.state.moveLog.length,
    cardsMaps,
  };
}

export async function alphaClashRestoreEngine(
  snapshot: EngineSnapshot,
  context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const { stateVersion: _persistedVersion, ...rawState } = snapshot.state as MatchState & {
    stateVersion?: number;
  };
  void _persistedVersion;
  return new AlphaClashServerEngine(rawState as MatchState, {
    [context.player1Id]: "player-one",
    [context.player2Id]: "player-two",
  });
}

export function alphaClashExtractCardsMapsFromSnapshot(snapshot: EngineSnapshot): CardsMaps {
  if (snapshot.cardsMaps) return snapshot.cardsMaps;
  const state = snapshot.state as MatchState | undefined;
  if (!state) return { cardInstances: {}, owners: {} };
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = { "player-one": [], "player-two": [] };
  for (const card of Object.values(state.cards)) {
    const definition = state.definitions[card.definitionId];
    cardInstances[card.instanceId] = definition?.id ?? card.definitionId;
    (owners[card.owner] ??= []).push(card.instanceId);
  }
  return { cardInstances, owners };
}

/** The engine's PRNG seed is a number; platform seeds are strings. */
function numericSeed(seed: string): number {
  const parsed = Number.parseInt(seed, 10);
  if (Number.isInteger(parsed) && String(parsed) === seed.trim()) return parsed;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function unwrap(engine: ServerGameEngine): AlphaClashServerEngine {
  if (engine instanceof AlphaClashServerEngine) return engine;
  throw new Error(
    "Alpha Clash adapter received a ServerGameEngine that is not an AlphaClashServerEngine. " +
      "This indicates a wiring bug in the game-server.",
  );
}
