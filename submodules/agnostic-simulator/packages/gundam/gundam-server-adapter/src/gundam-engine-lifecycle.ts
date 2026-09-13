import {
  LocalEngine,
  MatchRuntime,
  buildTokenUnitDefinition,
  createStaticResources,
  type CardCatalog,
  type GundamG,
  type MatchState,
  type Player,
  type TimeControlConfig as GundamTimeControlConfig,
} from "@tcg/gundam-engine";
import * as gundamCards from "@tcg/gundam-cards";
import {
  defaultGundamSetupCards,
  GUNDAM_HOST_SETUP_SLOT_EX_BASE,
  GUNDAM_HOST_SETUP_SLOT_EX_RESOURCE,
  TOKEN_PRINTINGS,
} from "@tcg/gundam-token-data";
import type { Card as GundamCard, TokenSpec } from "@tcg/gundam-types";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type {
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
  TimeControlConfig as UniversalTimeControlConfig,
} from "@tcg/shared/game-engine";
import { GundamServerEngine } from "./gundam-server-engine.js";
import { splitDeckForSetup } from "./gundam-deck-setup.js";
import { cardWithPresentationPrinting } from "./gundam-presentation.js";

let cachedCatalog: CardCatalog | null = null;

/**
 * Build a definition-keyed catalog from the Gundam card pool. Cached for the
 * process lifetime so we don't rebuild it on every match creation.
 *
 * Indexed by every identity the runtime may receive: `id` (printing-specific,
 * e.g. `R-001_p6`), `cardNumber`, `canonicalId` (e.g. `R-001`), and each
 * authored `printings[].id`. Resource cards carry a `cardNumber`/`canonicalId`
 * that differs from their printing `id`, so indexing those plus every
 * printing keeps catalog lookups — including setup-slot art and the legacy
 * type-classification fallback — from falling back to the default.
 */
function getGundamCatalog(): CardCatalog {
  if (cachedCatalog) return cachedCatalog;
  const defs = new Map<string, GundamCard>();
  for (const card of Object.values(gundamCards) as readonly unknown[]) {
    if (!card || typeof card !== "object") continue;
    const candidate = card as GundamCard;
    const keys = [candidate.id, candidate.cardNumber, candidate.canonicalId];
    for (const key of keys) {
      if (typeof key === "string" && !defs.has(key)) defs.set(key, candidate);
    }
    for (const printing of candidate.printings ?? []) {
      if (typeof printing.id !== "string" || defs.has(printing.id)) continue;
      defs.set(printing.id, cardWithPresentationPrinting(candidate, printing.id));
    }
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
  const catalog = getGundamCatalog();

  const players: Player[] = [input.player1Id, input.player2Id].map((playerId) => {
    const ownerInstanceIds = input.cardsMaps.owners[playerId] ?? [];
    const { deck, resourceDeck, rejected } = splitDeckForSetup(
      ownerInstanceIds,
      input.cardsMaps,
      catalog,
    );
    if (rejected && rejected.length > 0) {
      throw new Error(
        `Gundam match setup for ${playerId} received ${rejected.length} instance(s) ` +
          `without a resolvable deck section: ${rejected
            .map((entry) => entry.definitionId)
            .join(", ")}. ` +
          `The deck builder must tag every card with a section (main/resource).`,
      );
    }
    return {
      id: playerId as never,
      name: playerId,
      deck,
      resourceDeck,
    };
  });

  const setupCards = resolveSetupCards(
    players.map((player) => player.id),
    catalog,
    input.cardsMaps,
  );
  const remintedPresentation = remintGundamPresentation(input.cardsMaps);
  if (remintedPresentation) {
    input.cardsMaps.presentation = remintedPresentation;
  }
  const staticResources = createStaticResources(players, catalog, setupCards);
  const engine = new LocalEngine(staticResources);
  engine.initialize(players, input.seed, undefined, toGundamTimeControl(input.timeControl));
  seedInitialDeckZones(engine, players);
  return new GundamServerEngine(engine, staticResources, input.cardsMaps);
}

function resolveSetupCards(
  playerIds: readonly string[],
  catalog: CardCatalog,
  cardsMaps: CardsMaps,
): Record<string, Record<string, GundamCard>> {
  const defaults = defaultGundamSetupCards(playerIds);
  const selected = cardsMaps.presentation?.printingIdBySetupSlotByOwnerId ?? {};
  const slots = [GUNDAM_HOST_SETUP_SLOT_EX_BASE, GUNDAM_HOST_SETUP_SLOT_EX_RESOURCE] as const;
  const resolved: Record<string, Record<string, GundamCard>> = {};
  for (const playerId of playerIds) {
    resolved[playerId] = {};
    for (const slot of slots) {
      const printingId = selected[playerId]?.[slot];
      const fromCatalog = printingId
        ? (catalog.get(printingId) as GundamCard | undefined)
        : undefined;
      const fallback = defaults[playerId]?.[slot] as GundamCard | undefined;
      const def = fromCatalog ?? fallback;
      if (!def) {
        throw new Error(`Host must supply Gundam setup card ${slot} for ${playerId}`);
      }
      resolved[playerId][slot] = def;
    }
  }
  return resolved;
}

const ENGINE_INSTANCE_ZONE = /_(?:deck|resourceDeck)_/;

/** True when the id already uses the Gundam static-resources instance scheme. */
export function isGundamEngineInstanceId(instanceId: string): boolean {
  return ENGINE_INSTANCE_ZONE.test(instanceId);
}

/**
 * Rewrite platform instance ids (`owner-cardId-n`) onto the engine scheme
 * (`owner_deck|resourceDeck_definitionId_index`) so live/replay art lookup
 * matches minted zone cards. Already-reminted maps are preserved so restore
 * and a second remint do not drop presentation.
 */
export function remintGundamPresentation(
  platformMaps: CardsMaps,
): CardsMaps["presentation"] | undefined {
  const source = platformMaps.presentation?.printingIdByInstanceId;
  const setupSlots = platformMaps.presentation?.printingIdBySetupSlotByOwnerId;
  if (!source && !setupSlots) return undefined;

  const printingIdByInstanceId: Record<string, string> = {};
  if (source && !platformMaps.instanceSections) {
    Object.assign(printingIdByInstanceId, source);
  } else if (source) {
    const sections = platformMaps.instanceSections ?? {};
    for (const [playerId, ownerIds] of Object.entries(platformMaps.owners)) {
      const mainIds = ownerIds.filter((id) => sections[id] === "main");
      const resourceIds = ownerIds.filter((id) => sections[id] === "resource");
      assignEnginePrintings(
        mainIds,
        playerId,
        "deck",
        platformMaps.cardInstances,
        source,
        printingIdByInstanceId,
      );
      assignEnginePrintings(
        resourceIds,
        playerId,
        "resourceDeck",
        platformMaps.cardInstances,
        source,
        printingIdByInstanceId,
      );
    }
    for (const [instanceId, printingId] of Object.entries(source)) {
      if (
        isGundamEngineInstanceId(instanceId) &&
        printingIdByInstanceId[instanceId] === undefined
      ) {
        printingIdByInstanceId[instanceId] = printingId;
      }
    }
  }

  return {
    printingIdByInstanceId,
    ...(setupSlots ? { printingIdBySetupSlotByOwnerId: setupSlots } : {}),
  };
}

function assignEnginePrintings(
  platformIds: readonly string[],
  playerId: string,
  prefix: "deck" | "resourceDeck",
  cardInstances: Record<string, string>,
  source: Record<string, string>,
  out: Record<string, string>,
): void {
  platformIds.forEach((platformId, index) => {
    const definitionId = cardInstances[platformId];
    if (!definitionId) return;
    const printingId = source[platformId];
    if (!printingId) return;
    out[`${playerId}_${prefix}_${definitionId}_${index}`] = printingId;
  });
}

function toGundamTimeControl(
  config: UniversalTimeControlConfig | undefined,
): GundamTimeControlConfig | undefined {
  if (!config || config.mode === "none") return config;

  switch (config.mode) {
    case "dynamic": {
      const extras = config.extras ?? {};
      return {
        mode: "dynamic",
        config: {
          initialReserveMs: config.initialReserveMs,
          reserveCapMs: numericExtra(extras, "reserveCapMs", config.initialReserveMs),
          perActionBonusMs: config.perActionBonusMs ?? 0,
          perTurnPassBonusMs: config.turnPassBonusMs ?? 0,
          resetTimeOnSkipMs: numericExtra(extras, "resetTimeOnSkipMs", 0),
          graceMs: numericExtra(extras, "graceMs", 0),
          ...optionalNumericExtra(extras, "maxDecisionTimeMs"),
        },
      };
    }
    case "chess":
    case "priority":
      throw new Error(
        `Gundam adapter does not support time-control mode "${config.mode}". ` +
          `Supported modes: "none", "dynamic".`,
      );
    default:
      return assertNever(config);
  }
}

function numericExtra(extras: Record<string, unknown>, key: string, fallback: number): number {
  const value = extras[key];
  if (value === undefined) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`Gundam time-control extra "${key}" must be a finite non-negative number.`);
  }
  return value;
}

function optionalNumericExtra(
  extras: Record<string, unknown>,
  key: "maxDecisionTimeMs",
): { maxDecisionTimeMs?: number } {
  if (extras[key] === undefined) return {};
  return { maxDecisionTimeMs: numericExtra(extras, key, 0) };
}

function assertNever(value: never): never {
  throw new Error(`Unsupported Gundam time-control config: ${JSON.stringify(value)}`);
}

/**
 * Move each player's `deck` / `resourceDeck` into their zones.
 *
 * Gundam's `MatchRuntime.initialize` creates every zone empty — unlike
 * Cyberpunk's engine, it never seeds zones from `Player.deck` /
 * `Player.resourceDeck` — so without this step a server-authority match
 * starts with empty decks and the mulligan draws nothing. Browser-side
 * runtimes seed zones manually (dev-runtime `placeIntoRuntime`, test-engine
 * `placeCards`); this is the server-adapter equivalent.
 *
 * Instance IDs must match the scheme `createStaticResources` minted
 * (`${playerId}_${zoneId}_${definitionId}_${index}`) so the zone state stays
 * consistent with the static card registry.
 */
function seedInitialDeckZones(engine: LocalEngine, players: readonly Player[]): void {
  const state = engine.getState();
  const seedZone = (
    playerId: Player["id"],
    zoneId: "deck" | "resourceDeck",
    definitionIds: readonly string[],
  ): void => {
    const zoneKey = `${zoneId}:${playerId}`;
    const zoneCards = (state.ctx.zones.private.zoneCards[zoneKey] ??= []);
    const summary = (state.ctx.zones.public.zoneSummaries[zoneKey] ??= { revision: 0, count: 0 });
    definitionIds.forEach((definitionId, index) => {
      const instanceId = `${playerId}_${zoneId}_${definitionId}_${index}`;
      zoneCards.push(instanceId);
      state.ctx.zones.private.cardIndex[instanceId] = {
        zoneKey,
        index: zoneCards.length - 1,
        ownerID: playerId,
        controllerID: playerId,
      };
      state.ctx.zones.private.cardMeta[instanceId] = {};
      summary.count += 1;
      summary.revision += 1;
    });
  };
  for (const player of players) {
    seedZone(player.id, "deck", player.deck);
    seedZone(player.id, "resourceDeck", player.resourceDeck);
  }
}

/**
 * Lifecycle hook: build the persistence envelope from a Gundam engine.
 *
 * Gundam's MatchState is a closed-form snapshot — we serialize it directly
 * and hydrate it back into a fresh engine on restore.
 */
export function gundamSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const gundam = unwrap(engine);
  const runtime = gundam.engine.getRuntime();
  return {
    gameSlug: "gundam",
    state: gundam.engine.getState(),
    historyLength: 0,
    cardsMaps,
    metadata: {
      commandHistory: runtime.getCommandHistory(),
      undoStack: runtime.undoStack,
      undoBarriers: runtime.undoBarriers,
      moveHistory: runtime.getMoveHistory(),
      moveLogHistory: runtime.getMoveLogHistory(),
      gameLogHistory: runtime.getGameLogHistory(),
      packetAnimationHistory: runtime.getPacketAnimationHistory(),
    },
  };
}

/**
 * Lifecycle hook: rebuild a Gundam engine from a serialised snapshot.
 *
 * The snapshot carries the full MatchState (see {@link gundamSerializeEngine}),
 * so after recreating the engine shell from cardsMaps + seed we hydrate the
 * persisted state via `MatchRuntime.loadState`. Without hydration the rebuilt
 * engine would restart at version 0 — losing zones, pending decisions, and
 * the version counter — and every in-flight interaction would be rejected as
 * stale against the Redis-tracked version.
 */
export async function gundamRestoreEngine(
  snapshot: EngineSnapshot,
  context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const cardsMaps = snapshot.cardsMaps ?? { cardInstances: {}, owners: {} };
  const engine = await gundamCreateServerEngine({
    gameSlug: "gundam",
    seed: context.seed,
    player1Id: context.player1Id,
    player2Id: context.player2Id,
    cardsMaps,
  });
  if (snapshot.state) {
    const gundam = unwrap(engine);
    const undoMetadata = parseUndoMetadata(snapshot.metadata);
    gundam.engine.getRuntime().loadState(snapshot.state as MatchState<GundamG>, {
      ...undoMetadata,
      silent: true,
    });
    restorePersistedTokenDefinitions(gundam);
  }
  return engine;
}

function parseUndoMetadata(metadata: unknown): {
  commandHistory?: MatchRuntime["commandHistory"];
  undoStack?: MatchRuntime["undoStack"];
  undoBarriers?: readonly string[];
  moveHistory?: MatchRuntime["moveHistory"];
  moveLogHistory?: MatchRuntime["moveLogHistory"];
  gameLogHistory?: MatchRuntime["gameLogHistory"];
  packetAnimationHistory?: MatchRuntime["packetAnimationHistory"];
} {
  // The runtime validates no untrusted input here: snapshots are server-owned,
  // and the state and command shapes are already validated by the adapter that
  // produced them. Keep legacy snapshots (with no metadata) supported.
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
  const value = metadata as Record<string, unknown>;
  return {
    ...(Array.isArray(value.commandHistory)
      ? { commandHistory: value.commandHistory as MatchRuntime["commandHistory"] }
      : {}),
    ...(Array.isArray(value.undoStack)
      ? { undoStack: value.undoStack as MatchRuntime["undoStack"] }
      : {}),
    ...(Array.isArray(value.undoBarriers) && value.undoBarriers.every((x) => typeof x === "string")
      ? { undoBarriers: value.undoBarriers }
      : {}),
    ...(Array.isArray(value.moveHistory)
      ? { moveHistory: value.moveHistory as MatchRuntime["moveHistory"] }
      : {}),
    ...(Array.isArray(value.moveLogHistory)
      ? { moveLogHistory: value.moveLogHistory as MatchRuntime["moveLogHistory"] }
      : {}),
    ...(Array.isArray(value.gameLogHistory)
      ? {
          gameLogHistory: value.gameLogHistory as MatchRuntime["gameLogHistory"],
          logCounter: nextGameLogId(value.gameLogHistory),
        }
      : {}),
    ...(Array.isArray(value.packetAnimationHistory)
      ? {
          packetAnimationHistory:
            value.packetAnimationHistory as MatchRuntime["packetAnimationHistory"],
        }
      : {}),
  };
}

function nextGameLogId(history: readonly unknown[]): number {
  let maxId = -1;
  for (const item of history) {
    if (!item || typeof item !== "object") continue;
    const entry = (item as { entry?: unknown }).entry;
    if (!entry || typeof entry !== "object") continue;
    const id = (entry as { id?: unknown }).id;
    if (typeof id === "number" && Number.isInteger(id) && id > maxId) maxId = id;
  }
  return maxId + 1;
}

/**
 * Rebuild runtime registrations for tokens after state hydration.
 *
 * Token zones and metadata are part of MatchState, but definitions registered at
 * runtime live in MatchStaticResources. A freshly-created restore shell only has
 * deck-card definitions, so setup EX Base/Resource tokens otherwise survive in
 * their zones without a resolvable definition. Gameplay checks then see them as
 * ordinary cards. Register directly in the static maps to preserve the restored
 * zone index and metadata exactly as persisted.
 */
function restorePersistedTokenDefinitions(engine: GundamServerEngine): void {
  const state = engine.engine.getState() as MatchState<GundamG>;
  for (const [instanceId, meta] of Object.entries(state.ctx.zones.private.cardMeta)) {
    restoreLegacyTokenCounter(state.G, instanceId, "ex_resource_token_", "exResourceToken");
    restoreLegacyTokenCounter(state.G, instanceId, "ex_base_token_", "exBaseToken");
    if (meta?.isToken !== true) continue;
    if (engine.staticResources.cardsMaps.instances.get(instanceId)) continue;

    const definition = resolvePersistedTokenDefinition(engine, instanceId, meta);
    const location = state.ctx.zones.private.cardIndex[instanceId];
    if (!definition || !location) {
      console.warn("[gundam-restore] Unable to restore persisted token", {
        instanceId,
        tokenDefinitionId: meta.tokenDefinitionId,
        hasTokenSpec: isTokenSpec(meta.tokenSpec),
        definitionResolved: definition !== undefined,
        zoneIndexResolved: location !== undefined,
      });
      continue;
    }

    engine.staticResources.cardsMaps.instances.register(instanceId, {
      definitionId: instanceId,
      ownerID: location.ownerID,
    });
    engine.staticResources.cardsMaps.definitions.set(instanceId, definition);
  }
}

function resolvePersistedTokenDefinition(
  engine: GundamServerEngine,
  instanceId: string,
  meta: Record<string, unknown>,
): GundamCard | undefined {
  if (typeof meta.tokenDefinitionId === "string") {
    return engine.staticResources.getDefinition(meta.tokenDefinitionId);
  }
  if (!isTokenSpec(meta.tokenSpec)) return undefined;

  const printed = meta.tokenSpec.printedCardNumber
    ? TOKEN_PRINTINGS[meta.tokenSpec.printedCardNumber]
    : undefined;
  return buildTokenUnitDefinition(meta.tokenSpec, instanceId, printed);
}

function isTokenSpec(value: unknown): value is TokenSpec {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const validKeywords = new Set([
    "Repair",
    "Breach",
    "Support",
    "Blocker",
    "FirstStrike",
    "HighManeuver",
    "Suppression",
  ]);
  const validRestrictions = new Set([
    "cannotSetActive",
    "cannotPairPilot",
    "cannotActivateBlocker",
  ]);
  return (
    typeof candidate.name === "string" &&
    Array.isArray(candidate.traits) &&
    candidate.traits.every((trait) => typeof trait === "string") &&
    typeof candidate.ap === "number" &&
    Number.isFinite(candidate.ap) &&
    typeof candidate.hp === "number" &&
    Number.isFinite(candidate.hp) &&
    (candidate.deployState === "active" || candidate.deployState === "rested") &&
    (candidate.printedCardNumber === undefined ||
      typeof candidate.printedCardNumber === "string") &&
    (candidate.cantTargetPlayer === undefined || typeof candidate.cantTargetPlayer === "boolean") &&
    (candidate.restrictions === undefined ||
      (Array.isArray(candidate.restrictions) &&
        candidate.restrictions.every(
          (restriction) => typeof restriction === "string" && validRestrictions.has(restriction),
        ))) &&
    (candidate.keywordEffects === undefined ||
      (Array.isArray(candidate.keywordEffects) &&
        candidate.keywordEffects.every(
          (entry) =>
            entry !== null &&
            typeof entry === "object" &&
            "keyword" in entry &&
            typeof entry.keyword === "string" &&
            validKeywords.has(entry.keyword) &&
            (!("value" in entry) ||
              entry.value === undefined ||
              (typeof entry.value === "number" && Number.isFinite(entry.value))),
        )))
  );
}

function restoreLegacyTokenCounter(
  G: GundamG,
  instanceId: string,
  prefix: string,
  counterKey: "exResourceToken" | "exBaseToken",
): void {
  if (!instanceId.startsWith(prefix)) return;
  const index = Number(instanceId.slice(prefix.length));
  if (!Number.isSafeInteger(index) || index < 1) return;
  G.eventCounters[counterKey] = Math.max(G.eventCounters[counterKey] ?? 0, index);
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
