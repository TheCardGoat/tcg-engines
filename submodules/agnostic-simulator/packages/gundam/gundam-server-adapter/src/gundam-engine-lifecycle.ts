import {
  LocalEngine,
  createStaticResources,
  type CardCatalog,
  type Player,
} from "@tcg/gundam-engine";
import * as gundamCards from "@tcg/gundam-cards";
import type { Card as GundamCard } from "@tcg/gundam-types";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type {
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import { GundamServerEngine } from "./gundam-server-engine.js";
import { splitDeckByType } from "./gundam-deck-setup.js";

let cachedCatalog: CardCatalog | null = null;

/**
 * Build a definition-keyed catalog from the Gundam card pool. Cached for the
 * process lifetime so we don't rebuild it on every match creation.
 */
function getGundamCatalog(): CardCatalog {
  if (cachedCatalog) return cachedCatalog;
  const defs = new Map<string, GundamCard>();
  for (const card of Object.values(gundamCards) as readonly unknown[]) {
    if (!card || typeof card !== "object") continue;
    const candidate = card as { id?: unknown; cardNumber?: unknown };
    const key =
      typeof candidate.id === "string"
        ? candidate.id
        : typeof candidate.cardNumber === "string"
          ? candidate.cardNumber
          : undefined;
    if (key) defs.set(key, card as GundamCard);
  }
  cachedCatalog = {
    get(definitionId: string) {
      return defs.get(definitionId);
    },
  } as CardCatalog;
  return cachedCatalog;
}

/**
 * Lifecycle hook: create a freshly-initialised {@link GundamServerEngine}.
 */
export async function gundamCreateServerEngine(
  input: ServerEngineCreateInput,
): Promise<ServerGameEngine> {
  // Gundam's MatchRuntime does have a TimeContext, but the LocalEngine entry
  // point we use here doesn't expose a way to plumb the universal config
  // into runtime initialisation yet. For now, accept `mode: "none"` (or no
  // config) and reject everything else so callers learn that the wiring is
  // pending instead of silently losing their clock settings.
  if (input.timeControl && input.timeControl.mode !== "none") {
    throw new Error(
      `Gundam adapter does not support time-control mode "${input.timeControl.mode}" ` +
        `until the universal config is wired through MatchRuntime.initialize. ` +
        `See docs/follow-up-universal-time-control.md.`,
    );
  }
  const catalog = getGundamCatalog();

  const players: Player[] = [input.player1Id, input.player2Id].map((playerId) => {
    const ownerInstanceIds = input.cardsMaps.owners[playerId] ?? [];
    const { deck, resourceDeck } = splitDeckByType(ownerInstanceIds, input.cardsMaps, catalog);
    return {
      id: playerId as never,
      name: playerId,
      deck,
      resourceDeck,
    };
  });

  const staticResources = createStaticResources(players, catalog);
  const engine = new LocalEngine(staticResources);
  engine.initialize(players, input.seed);
  return new GundamServerEngine(engine, staticResources);
}

/**
 * Lifecycle hook: build the persistence envelope from a Gundam engine.
 *
 * Gundam's MatchState is a closed-form snapshot — we serialize it directly
 * and rebuild a fresh engine on restore.
 */
export function gundamSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const gundam = unwrap(engine);
  return {
    gameSlug: "gundam",
    state: gundam.engine.getState(),
    historyLength: 0,
    cardsMaps,
  };
}

/**
 * Lifecycle hook: rebuild a Gundam engine from a serialised snapshot.
 *
 * NOTE: full state restoration into a fresh `LocalEngine` requires a
 * MatchRuntime hydration entry point that the engine doesn't currently
 * expose publicly. For now we recreate the engine from cardsMaps + seed and
 * trust the MatchState snapshot to be re-applied via patches; this matches
 * the existing Cyberpunk pathway. When a richer
 * `restoreAuthoritativeSnapshot` lands, we'll thread it through here.
 */
export async function gundamRestoreEngine(
  snapshot: EngineSnapshot,
  context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const cardsMaps = snapshot.cardsMaps ?? { cardInstances: {}, owners: {} };
  return gundamCreateServerEngine({
    gameSlug: "gundam",
    seed: context.seed,
    player1Id: context.player1Id,
    player2Id: context.player2Id,
    cardsMaps,
  });
}

/**
 * Lifecycle hook: pull cardsMaps out of a serialised snapshot without
 * instantiating an engine.
 */
export function gundamExtractCardsMapsFromSnapshot(snapshot: EngineSnapshot): CardsMaps {
  return snapshot.cardsMaps ?? { cardInstances: {}, owners: {} };
}

function unwrap(engine: ServerGameEngine): GundamServerEngine {
  if (engine instanceof GundamServerEngine) return engine;
  throw new Error(
    "Gundam adapter received a ServerGameEngine that is not a GundamServerEngine. " +
      "This indicates a wiring bug in the game-server.",
  );
}
