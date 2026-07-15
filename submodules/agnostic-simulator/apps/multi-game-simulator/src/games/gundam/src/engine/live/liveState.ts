import {
  LocalEngine,
  asPlayerId,
  buildTokenUnitDefinition,
  createStaticResources,
  type CardCatalog,
  type MatchRuntime,
  type MatchStaticResources,
  type Player,
} from "@tcg/gundam-engine";
import * as gundamCards from "@tcg/gundam-cards";
import type {
  Card as GundamCard,
  KeywordEffect,
  KeywordEffectEntry,
  TokenSpec,
} from "@tcg/gundam-types";

type TokenRestriction = NonNullable<TokenSpec["restrictions"]>[number];

const TOKEN_KEYWORD_ALLOWLIST = {
  Repair: true,
  Breach: true,
  Support: true,
  Blocker: true,
  FirstStrike: true,
  HighManeuver: true,
  Suppression: true,
} satisfies Record<KeywordEffect, true>;
const TOKEN_RESTRICTION_ALLOWLIST = {
  cannotSetActive: true,
  cannotPairPilot: true,
} satisfies Record<TokenRestriction, true>;

const TOKEN_KEYWORDS: ReadonlySet<KeywordEffect> = new Set(
  Object.keys(TOKEN_KEYWORD_ALLOWLIST) as KeywordEffect[],
);
const TOKEN_RESTRICTIONS: ReadonlySet<TokenRestriction> = new Set(
  Object.keys(TOKEN_RESTRICTION_ALLOWLIST) as TokenRestriction[],
);

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
 *   3) cardsMaps: prime `instances` from every entry in the serialized
 *      card index. Ordinary cards encode their definition id in the
 *      instance id. Printed tokens carry a stable `tokenDefinitionId`;
 *      dynamically-created Unit tokens instead carry a public `tokenSpec`,
 *      so we rebuild their runtime definition from that spec and enrich it
 *      with any printed token card named by `printedCardNumber`.
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
 * `{ definitionId, ownerID }` on the staticResources. Ordinary card
 * instances encode their definition id in the id. Generated tokens use
 * their serialized public token metadata instead.
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
  const cardMeta = zones.private.cardMeta as Record<string, unknown> | undefined;
  if (!cardIndex) return;

  for (const [instanceId, meta] of Object.entries(cardIndex)) {
    if (staticResources.cardsMaps.instances.get(instanceId)) continue;
    const parsed = parseInstanceId(instanceId);
    if (parsed) {
      const ownerID = meta.ownerID ?? parsed.ownerId;
      staticResources.cardsMaps.instances.register(instanceId, {
        definitionId: parsed.definitionId,
        ownerID,
      });
      if (!staticResources.cardsMaps.definitions.has(parsed.definitionId)) {
        const def = catalog.get(parsed.definitionId);
        if (def) staticResources.cardsMaps.definitions.set(parsed.definitionId, def);
      }
      continue;
    }

    const tokenDefinitionId = tokenDefinitionIdFromMeta(cardMeta?.[instanceId]);
    if (tokenDefinitionId && typeof meta.ownerID === "string") {
      const definition = catalog.get(tokenDefinitionId);
      if (definition) {
        staticResources.cardsMaps.instances.register(instanceId, {
          definitionId: tokenDefinitionId,
          ownerID: meta.ownerID,
        });
        if (!staticResources.cardsMaps.definitions.has(tokenDefinitionId)) {
          staticResources.cardsMaps.definitions.set(tokenDefinitionId, definition);
        }
        continue;
      }
    }

    const tokenSpec = tokenSpecFromMeta(cardMeta?.[instanceId]);
    if (!tokenSpec || typeof meta.ownerID !== "string") continue;
    const catalogCard = tokenSpec.printedCardNumber
      ? catalog.get(tokenSpec.printedCardNumber)
      : undefined;
    const printed = catalogCard?.type === "unit" ? catalogCard : undefined;
    const definition = buildTokenUnitDefinition(tokenSpec, instanceId, printed);
    staticResources.cardsMaps.instances.register(instanceId, {
      definitionId: instanceId,
      ownerID: meta.ownerID,
    });
    staticResources.cardsMaps.definitions.set(instanceId, definition);
  }
}

function tokenDefinitionIdFromMeta(meta: unknown): string | null {
  if (!isRecord(meta) || meta.isToken !== true || typeof meta.tokenDefinitionId !== "string") {
    return null;
  }
  return meta.tokenDefinitionId;
}

function tokenSpecFromMeta(meta: unknown): TokenSpec | null {
  if (!isRecord(meta) || meta.isToken !== true || !isRecord(meta.tokenSpec)) return null;
  const raw = meta.tokenSpec;
  if (
    typeof raw.name !== "string" ||
    !Array.isArray(raw.traits) ||
    !raw.traits.every((trait): trait is string => typeof trait === "string") ||
    typeof raw.ap !== "number" ||
    !Number.isFinite(raw.ap) ||
    typeof raw.hp !== "number" ||
    !Number.isFinite(raw.hp) ||
    (raw.deployState !== "active" && raw.deployState !== "rested")
  ) {
    return null;
  }

  const keywordEffects = keywordEffectsFromUnknown(raw.keywordEffects);
  const restrictions = restrictionsFromUnknown(raw.restrictions);
  if (keywordEffects === null || restrictions === null) return null;
  if (raw.cantTargetPlayer !== undefined && typeof raw.cantTargetPlayer !== "boolean") return null;
  if (raw.printedCardNumber !== undefined && typeof raw.printedCardNumber !== "string") return null;

  return {
    name: raw.name,
    traits: [...raw.traits],
    ap: raw.ap,
    hp: raw.hp,
    deployState: raw.deployState,
    ...(keywordEffects === undefined ? {} : { keywordEffects }),
    ...(raw.cantTargetPlayer === undefined ? {} : { cantTargetPlayer: raw.cantTargetPlayer }),
    ...(restrictions === undefined ? {} : { restrictions }),
    ...(raw.printedCardNumber === undefined ? {} : { printedCardNumber: raw.printedCardNumber }),
  };
}

function keywordEffectsFromUnknown(value: unknown): KeywordEffectEntry[] | undefined | null {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return null;
  const entries: KeywordEffectEntry[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate) || !isKeywordEffect(candidate.keyword)) return null;
    if (
      candidate.value !== undefined &&
      (typeof candidate.value !== "number" || !Number.isFinite(candidate.value))
    ) {
      return null;
    }
    entries.push({
      keyword: candidate.keyword,
      ...(candidate.value === undefined ? {} : { value: candidate.value }),
    });
  }
  return entries;
}

function restrictionsFromUnknown(value: unknown): TokenRestriction[] | undefined | null {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return null;
  const restrictions: TokenRestriction[] = [];
  for (const candidate of value) {
    if (typeof candidate !== "string" || !isUnitRestriction(candidate)) return null;
    restrictions.push(candidate);
  }
  return restrictions;
}

function isKeywordEffect(value: unknown): value is KeywordEffect {
  return typeof value === "string" && TOKEN_KEYWORDS.has(value as KeywordEffect);
}

function isUnitRestriction(value: string): value is TokenRestriction {
  return TOKEN_RESTRICTIONS.has(value as TokenRestriction);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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
