import {
  LocalEngine,
  asPlayerId,
  createStaticResources,
  type CardCatalog,
  type MatchRuntime,
  type MatchStaticResources,
  type Player,
} from "@tcg/gundam-engine";
import * as gundamCards from "@tcg/gundam-cards";
import type { Card as GundamCard } from "@tcg/gundam-types";

/**
 * Build a live-match viewer engine from a server-authored state snapshot.
 *
 * Server states are *just* the engine state — they don't carry the
 * static resources (catalog + cardsMaps + players) that the viewer
 * engine needs at construction time. We rebuild those from scratch by:
 *
 *   1) catalog: a process-cached catalog over every `@tcg/gundam-cards`
 *      export, so every definitionId resolves to a card.
 *   2) players: synthesised from `state.ctx.playerIds` with empty
 *      decks. The deck/resourceDeck arrays are only used by
 *      `createStaticResources` to mint initial instance ids and by
 *      `engine.initialize` to seed zones; we throw all of that away
 *      via `loadState` so empty is fine.
 *   3) cardsMaps: prime `instances` by parsing every instance id we
 *      see in `state.ctx.zones.{private,public}.cardIndex`. Gundam
 *      instance ids follow `${playerId}_${prefix}_${definitionId}_${i}`
 *      (see `static-resources.ts::registerCards`), so we can recover
 *      `{ definitionId, ownerID }` deterministically from the id
 *      alone. Without this prime, render-time card lookups would
 *      return `undefined` for every card on the table.
 */
export function createLiveMatchViewerEngine(serverState: Record<string, unknown>): {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerPlayerId: string;
} {
  const catalog = getCatalog();
  const playerIds = extractPlayerIds(serverState);
  const players: Player[] = playerIds.map((id) => ({
    id: asPlayerId(id),
    name: id,
    deck: [],
    resourceDeck: [],
  }));

  const staticResources = createStaticResources(players, catalog);
  primeInstancesFromState(staticResources, serverState, catalog);

  const engine = new LocalEngine(staticResources);
  engine.initialize(players, "live-match-viewer-seed");
  // `loadState` overwrites runtime state, including all zone contents
  // and turn cycle. silent:false lets `onStateUpdate` listeners fire,
  // so the React store re-renders after every server snapshot.
  engine.getRuntime().loadState(serverState as never, { silent: false });

  return {
    runtime: engine.getRuntime(),
    staticResources,
    viewerPlayerId: playerIds[0] ?? "",
  };
}

/**
 * Apply a fresh server snapshot to an already-running viewer runtime.
 * Re-primes the static resources' cardsMaps in case the new state
 * references instance ids minted server-side after the last snapshot
 * (e.g. tokens spawned during a phase the viewer never saw locally).
 */
export function applyLiveStateUpdate(
  runtime: MatchRuntime,
  staticResources: MatchStaticResources,
  serverState: Record<string, unknown>,
): void {
  primeInstancesFromState(staticResources, serverState, getCatalog());
  runtime.loadState(serverState as never, { silent: false });
}

let cachedCatalog: CardCatalog | null = null;

function getCatalog(): CardCatalog {
  if (cachedCatalog) return cachedCatalog;
  const defs = new Map<string, GundamCard>();
  for (const card of Object.values(gundamCards) as readonly unknown[]) {
    if (!card || typeof card !== "object") continue;
    const candidate = card as { id?: unknown; cardNumber?: unknown };
    if (typeof candidate.cardNumber === "string")
      defs.set(candidate.cardNumber, card as GundamCard);
    if (typeof candidate.id === "string") defs.set(candidate.id, card as GundamCard);
  }
  cachedCatalog = {
    get(definitionId: string) {
      return defs.get(definitionId);
    },
  } as CardCatalog;
  return cachedCatalog;
}

/**
 * Walk every cardIndex entry in the state and register the underlying
 * `{ definitionId, ownerID }` on the staticResources. Parses the
 * instance id to recover the definitionId — it's structurally encoded
 * in the id by `createStaticResources::registerCards`.
 */
function primeInstancesFromState(
  staticResources: MatchStaticResources,
  serverState: Record<string, unknown>,
  catalog: CardCatalog,
): void {
  const ctx = (serverState as { ctx?: Record<string, unknown> }).ctx;
  if (!ctx) return;
  const zones = ctx.zones as { private?: Record<string, unknown> } | undefined;
  if (!zones?.private) return;
  const cardIndex = zones.private.cardIndex as Record<string, { ownerID?: string }> | undefined;
  if (!cardIndex) return;

  for (const [instanceId, meta] of Object.entries(cardIndex)) {
    if (staticResources.cardsMaps.instances.get(instanceId)) continue;
    const parsed = parseInstanceId(instanceId);
    if (!parsed) continue;
    const ownerID = meta.ownerID ?? parsed.ownerId;
    staticResources.cardsMaps.instances.register(instanceId, {
      definitionId: parsed.definitionId,
      ownerID,
    });
    if (!staticResources.cardsMaps.definitions.has(parsed.definitionId)) {
      const def = catalog.get(parsed.definitionId);
      if (def) staticResources.cardsMaps.definitions.set(parsed.definitionId, def);
    }
  }
}

/**
 * Reverse of `createStaticResources::registerCards`: parse
 * `${playerId}_${prefix}_${definitionId}_${i}` into its parts.
 *
 * Player ids may themselves contain underscores (no constraint in the
 * engine), so we anchor on the *prefix* (deck | resourceDeck) and the
 * trailing numeric index. The slice between is the definitionId.
 */
function parseInstanceId(instanceId: string): { ownerId: string; definitionId: string } | null {
  const lastUnderscore = instanceId.lastIndexOf("_");
  if (lastUnderscore < 0) return null;
  const tail = instanceId.slice(lastUnderscore + 1);
  if (!/^\d+$/.test(tail)) return null;
  const withoutIndex = instanceId.slice(0, lastUnderscore);
  for (const prefix of ["resourceDeck", "deck"]) {
    const marker = `_${prefix}_`;
    const idx = withoutIndex.indexOf(marker);
    if (idx < 0) continue;
    return {
      ownerId: withoutIndex.slice(0, idx),
      definitionId: withoutIndex.slice(idx + marker.length),
    };
  }
  return null;
}

function extractPlayerIds(serverState: Record<string, unknown>): string[] {
  const ctx = (serverState as { ctx?: { playerIds?: unknown } }).ctx;
  const raw = ctx?.playerIds;
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === "string");
}
