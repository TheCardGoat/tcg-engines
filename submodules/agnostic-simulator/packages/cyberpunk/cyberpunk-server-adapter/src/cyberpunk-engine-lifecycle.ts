import {
  LocalEngine,
  createMatchState,
  createPlayerId as createCyberpunkPlayerId,
  setCardRegistry,
  type CardCatalog,
  type DeckList,
  type MatchState,
  type PlayerSetup,
} from "@tcg/cyberpunk-engine";
import { structuredCards as cyberpunkStructuredCards } from "@tcg/cyberpunk-cards";
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
 * Build a catalog from the cyberpunk card pool. Match creation receives deck
 * entries as public slugs, while serialized engine state stores each card
 * instance by the stable card UUID. Accept both forms so fresh setup and later
 * snapshot restores share one registry.
 */
function getCyberpunkCatalog(): CardCatalog {
  if (registeredCatalog) return registeredCatalog;
  const defsByLookupKey = new Map<string, CyberpunkCardDefinition>();
  for (const card of cyberpunkStructuredCards) {
    const def = card as unknown as CyberpunkCardDefinition;
    defsByLookupKey.set(card.id, def);
    defsByLookupKey.set(card.slug, def);
  }
  const catalog: CardCatalog = {
    get(idOrSlug: string) {
      return defsByLookupKey.get(idOrSlug);
    },
    *entries(): IterableIterator<[string, CyberpunkCardDefinition]> {
      for (const card of cyberpunkStructuredCards) {
        yield [card.id, card as unknown as CyberpunkCardDefinition];
      }
    },
    get size() {
      return cyberpunkStructuredCards.length;
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
  return new CyberpunkServerEngine(new LocalEngine(snapshot.state as MatchState));
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
