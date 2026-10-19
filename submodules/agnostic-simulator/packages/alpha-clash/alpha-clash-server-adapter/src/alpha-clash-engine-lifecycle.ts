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
import { readAlphaClashUndoState } from "./undo";
import { alphaClashReleaseDeckIssue } from "./release-policy";

const SEAT_ORDER: readonly PlayerId[] = ["player-one", "player-two"];

/** Game-owned section ids used by deck admission and setup. */
export const ALPHA_CLASH_CONTENDER_SECTION_ID = "contender";
export const ALPHA_CLASH_MAIN_SECTION_ID = "main";
export const ALPHA_CLASH_SIDEBOARD_SECTION_ID = "sideboard";

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
  const mainDeck: string[] = [];

  for (const instanceId of instanceIds) {
    const cardId = cardsMaps.cardInstances[instanceId];
    if (!cardId) continue;
    const section = cardsMaps.instanceSections?.[instanceId];
    if (section === ALPHA_CLASH_SIDEBOARD_SECTION_ID) continue;
    const card = getCard(cardId);
    if (
      section === ALPHA_CLASH_CONTENDER_SECTION_ID ||
      (!section && card.cardType === "contender")
    ) {
      contenderId ??= cardId;
    } else {
      mainDeck.push(cardId);
    }
  }

  return { contenderId, mainDeck };
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
    const admissionIssue = alphaClashReleaseDeckIssue(
      instanceIds.map((instanceId) => ({
        cardId: input.cardsMaps.cardInstances[instanceId] ?? "",
        quantity: 1,
        sectionId: input.cardsMaps.instanceSections?.[instanceId],
      })),
    );
    if (admissionIssue)
      throw new Error(`Alpha Clash release admission for ${playerId}: ${admissionIssue}`);
    const { contenderId, mainDeck } = classifyDeck(instanceIds, input.cardsMaps);
    if (!contenderId) {
      throw new Error(`Alpha Clash deck for ${playerId} does not contain a Contender card.`);
    }
    players[seat] = { name: playerId, deck: { contenderId, deckIds: mainDeck } };
  }

  const firstPlayerId = input.firstTurnPlayerId ?? input.firstPlayerChooserId;
  if (firstPlayerId !== undefined && !playerIds.includes(firstPlayerId)) {
    throw new Error("Alpha Clash starting player must be one of the match players.");
  }
  const firstPlayer: PlayerId | undefined = firstPlayerId
    ? firstPlayerId === input.player2Id
      ? "player-two"
      : "player-one"
    : undefined;
  const options: CreateMatchOptions = {
    id: input.matchID ?? input.gameID ?? `alpha-clash-${crypto.randomUUID()}`,
    ...(input.seed !== undefined ? { seed: numericSeed(input.seed) } : {}),
    ...(firstPlayer ? { firstPlayer } : {}),
    players,
    validateDeck: true,
  };

  const state = createInitialState(options);
  // Opening draw logs are not accepted commands. New hosted games begin at
  // the platform's version zero, then advance once per accepted command.
  state.stateID = 0;
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
    // Persist the accepted-command version explicitly, including version-only
    // envelopes supported by the platform's stateVersionFromSnapshot reader.
    state: { ...state, stateVersion: alphaClash.getStateID() },
    historyLength: alphaClash.state.moveLog.length,
    cardsMaps,
    metadata: {
      undoCheckpoints: alphaClash.getUndoState().checkpoints,
      turnStartCheckpoint: alphaClash.getUndoState().turnStart,
      turnStartStateVersion: alphaClash.getUndoState().turnStartStateVersion,
    },
  };
}

export async function alphaClashRestoreEngine(
  snapshot: EngineSnapshot,
  context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const { stateVersion: persistedVersion, ...state } = snapshot.state as MatchState & {
    stateVersion?: unknown;
  };
  // Match platform precedence. Logs are a legacy fallback only when neither
  // accepted-command version field is present; one command can emit many logs.
  const version =
    state.stateID ?? (persistedVersion !== undefined ? persistedVersion : state.moveLog.length);
  if (typeof version !== "number" || !Number.isSafeInteger(version) || version < 0)
    throw new Error("Invalid Alpha Clash snapshot state version.");
  state.stateID = version;
  return new AlphaClashServerEngine(
    state,
    {
      [context.player1Id]: "player-one",
      [context.player2Id]: "player-two",
    },
    readAlphaClashUndoState(snapshot.metadata, state, version),
  );
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
