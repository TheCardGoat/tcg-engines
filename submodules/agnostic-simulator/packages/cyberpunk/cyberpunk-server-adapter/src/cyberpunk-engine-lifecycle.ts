import {
  LocalEngine,
  createMatchState,
  createPlayerId as createCyberpunkPlayerId,
  setCardRegistry,
  type CardCatalog,
  type DeckList,
  type LocalEngineContinuationSnapshot,
  type MatchState,
  type PlayerSetup,
  type TurnStartCheckpoint,
} from "@tcg/cyberpunk-engine";
import { getMergedCyberpunkCards, getMergedCyberpunkCardsById } from "@tcg/cyberpunk-cards";
import type { CardDefinition as CyberpunkCardDefinition } from "@tcg/cyberpunk-types";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type {
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
  TimeControlConfig,
} from "@tcg/shared/game-engine";
import { CyberpunkServerEngine } from "./cyberpunk-server-engine";

let registeredCatalog: CardCatalog | null = null;

type CyberpunkTimeControlConfig =
  | { mode: "none" }
  | {
      mode: "dynamic";
      config: {
        initialReserveMs: number;
        reserveCapMs: number;
        perActionBonusMs: number;
        perTurnPassBonusMs: number;
        resetTimeOnSkipMs: number;
        graceMs: number;
        maxDecisionTimeMs?: number;
      };
    };

/**
 * Build a catalog from the merged cyberpunk card pool. Match creation receives
 * deck entries as public slugs, while serialized engine state stores each card
 * instance by the stable card UUID. Accept both forms so fresh setup and later
 * snapshot restores share one registry.
 *
 * Deck rows are validated against the merged, accent-folded identity map, so
 * engine setup resolves folded slugs and legacy accent-mangled slugs (see
 * `legacyAccentMangledSlugAliases` in @tcg/cyberpunk-cards) — the raw
 * structured pool alone cannot.
 */
function getCyberpunkCatalog(): CardCatalog {
  if (registeredCatalog) return registeredCatalog;
  const mergedCards = getMergedCyberpunkCards();
  const defsByLookupKey = new Map<string, CyberpunkCardDefinition>(getMergedCyberpunkCardsById());
  const catalog: CardCatalog = {
    get(idOrSlug: string) {
      return defsByLookupKey.get(idOrSlug);
    },
    *entries(): IterableIterator<[string, CyberpunkCardDefinition]> {
      for (const card of mergedCards) {
        yield [card.id, card];
      }
    },
    get size() {
      return mergedCards.length;
    },
  };
  setCardRegistry(catalog);
  registeredCatalog = catalog;
  return catalog;
}

/**
 * Create a freshly-initialised {@link CyberpunkServerEngine} from the play
 * module's generic create-input. Splits each player's `cardsMaps` into
 * legends and main-deck slugs based on the card type from the catalog.
 */
export async function cyberpunkCreateServerEngine(
  input: ServerEngineCreateInput,
): Promise<ServerGameEngine> {
  const catalog = getCyberpunkCatalog();
  const players: PlayerSetup[] = [
    { id: createCyberpunkPlayerId(input.player1Id), name: input.player1Id },
    { id: createCyberpunkPlayerId(input.player2Id), name: input.player2Id },
  ];

  const deckLists: DeckList[] = [input.player1Id, input.player2Id].map((playerId) => {
    const instanceIds = input.cardsMaps.owners[playerId] ?? [];
    const legends: string[] = [];
    const mainDeck: string[] = [];
    for (const instanceId of instanceIds) {
      const slug = input.cardsMaps.cardInstances[instanceId];
      if (!slug) continue;
      const def = catalog.get(slug);
      if (def?.type === "legend") legends.push(slug);
      else mainDeck.push(slug);
    }
    return { playerId, playerName: playerId, legends, mainDeck };
  });

  const state = createMatchState({
    players,
    catalog,
    deckLists,
    seed: input.seed,
    matchId: input.matchID,
    timeControl: toCyberpunkTimeControl(input.timeControl),
  });
  return new CyberpunkServerEngine(new LocalEngine(state));
}

/**
 * Build the persistence envelope from a Cyberpunk engine.
 */
export function cyberpunkSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const cyberpunk = unwrap(engine);
  return {
    gameSlug: "cyberpunk",
    state: cyberpunk.getRawState(),
    historyLength: 0,
    cardsMaps,
    metadata: { continuation: cyberpunk.engine.getContinuationSnapshot() },
  };
}

/**
 * Recreate a Cyberpunk engine from a previously serialised snapshot.
 */
export async function cyberpunkRestoreEngine(
  snapshot: EngineSnapshot,
  _context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  getCyberpunkCatalog();
  const continuation = parseContinuation(snapshot.metadata);
  return new CyberpunkServerEngine(
    new LocalEngine(snapshot.state as MatchState, {
      ...(continuation ? { continuation } : { initializeTurnStartCheckpoint: false }),
    }),
  );
}

/**
 * Cyberpunk implementation of {@link GameAdapter.extractCardsMapsFromSnapshot}.
 */
export function cyberpunkExtractCardsMapsFromSnapshot(snapshot: EngineSnapshot): CardsMaps {
  return snapshot.cardsMaps ?? { cardInstances: {}, owners: {} };
}

function unwrap(engine: ServerGameEngine): CyberpunkServerEngine {
  if (engine instanceof CyberpunkServerEngine) return engine;
  throw new Error(
    "Cyberpunk adapter received a ServerGameEngine that is not a CyberpunkServerEngine. " +
      "This indicates a wiring bug in the game-server.",
  );
}

function parseContinuation(metadata: unknown): LocalEngineContinuationSnapshot | undefined {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  const continuation = (metadata as { continuation?: unknown }).continuation;
  if (!continuation || typeof continuation !== "object" || Array.isArray(continuation)) {
    return undefined;
  }
  const candidate = continuation as Partial<LocalEngineContinuationSnapshot>;
  if (
    candidate.version !== 1 ||
    !Array.isArray(candidate.undoStack) ||
    !(
      candidate.turnStartCheckpoint === null || isTurnStartCheckpoint(candidate.turnStartCheckpoint)
    )
  ) {
    return undefined;
  }
  if (
    !candidate.undoStack.every(
      (entry) =>
        entry !== null &&
        typeof entry === "object" &&
        "state" in entry &&
        Array.isArray((entry as { inversePatches?: unknown }).inversePatches),
    )
  ) {
    return undefined;
  }
  return candidate as LocalEngineContinuationSnapshot;
}

function isTurnStartCheckpoint(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Partial<TurnStartCheckpoint>;
  return (
    "state" in candidate &&
    typeof candidate.activePlayerId === "string" &&
    typeof candidate.turnNumber === "number" &&
    typeof candidate.stackDepth === "number" &&
    typeof candidate.signature === "string"
  );
}

function toCyberpunkTimeControl(
  config: TimeControlConfig | undefined,
): CyberpunkTimeControlConfig | undefined {
  if (!config || config.mode === "none") return config;

  if (config.mode !== "dynamic") {
    throw new Error(
      `Cyberpunk adapter does not support time-control mode "${config.mode}". ` +
        `Only "dynamic" and "none" are currently implemented.`,
    );
  }

  const extras = config.extras ?? {};
  const maxDecisionTimeMs = optionalNumberExtra(extras.maxDecisionTimeMs);
  return {
    mode: "dynamic",
    config: {
      initialReserveMs: config.initialReserveMs,
      reserveCapMs: numberExtra(extras.reserveCapMs, config.initialReserveMs),
      perActionBonusMs: config.perActionBonusMs ?? 0,
      perTurnPassBonusMs: config.turnPassBonusMs ?? 0,
      resetTimeOnSkipMs: numberExtra(extras.resetTimeOnSkipMs, 0),
      graceMs: numberExtra(extras.graceMs, 0),
      ...(maxDecisionTimeMs !== undefined ? { maxDecisionTimeMs } : {}),
    },
  };
}

function numberExtra(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function optionalNumberExtra(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
