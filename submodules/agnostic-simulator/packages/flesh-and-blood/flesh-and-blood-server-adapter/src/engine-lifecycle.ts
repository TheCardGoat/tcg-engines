import { createFabClock, readFabClock } from "./clock.ts";
import {
  allFleshAndBloodCards,
  fleshAndBloodPublicCardIdentities,
  getFleshAndBloodCard,
  getFleshAndBloodPhysicalCanonicalId,
} from "@tcg/flesh-and-blood-cards/catalog";
import {
  PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID,
  loadFleshAndBloodStructuredCards,
} from "@tcg/flesh-and-blood-cards/runtime-registry";
import {
  FabMatchRuntime,
  createFabMatchContext,
  createFabMatchInitialState,
  restoreFabMatchSnapshot,
  toFabCardDefinition,
  type FabRegisteredCardDefinition,
} from "@tcg/flesh-and-blood-engine/runtime";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import type {
  EngineSnapshot,
  ServerEngineCreateInput,
  ServerEngineRestoreContext,
  ServerGameEngine,
} from "@tcg/shared/game-engine";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

/** Lazy slug → canonicalId index (catalog + structured modules). */
let slugToCanonical: Map<string, string> | null = null;

function getSlugToCanonicalIndex(): Map<string, string> {
  if (slugToCanonical) return slugToCanonical;
  const index = new Map<string, string>();
  for (const card of allFleshAndBloodCards) {
    if (card.slug && !index.has(card.slug)) index.set(card.slug, card.canonicalId);
  }
  slugToCanonical = index;
  return index;
}

/**
 * Resolve an engine-native definition for a deck/instance card id.
 * Prefers structured modules (abilities/keywords) over the display catalog.
 * Accepts canonical ids, printing ids, or slugs.
 */
export function resolveFabEngineCardDefinition(
  cardId: string,
): FabRegisteredCardDefinition | undefined {
  const catalog = getFleshAndBloodCard(cardId);
  const canonicalId =
    getFleshAndBloodPhysicalCanonicalId(cardId) ??
    (catalog ? getFleshAndBloodPhysicalCanonicalId(catalog.canonicalId) : undefined) ??
    getSlugToCanonicalIndex().get(cardId);

  if (!canonicalId) return undefined;

  const structured = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(canonicalId);
  return structured ? toFabCardDefinition(structured) : undefined;
}

/**
 * Build the match-scoped definition registry from the cards present in the
 * play module's instance map. Keys every known alias so `lookupCard` works
 * whether decks store printing ids, slugs, or canonical ids.
 */
export function buildFabEngineCardDefinitions(
  cardsMaps: CardsMaps,
): Record<string, FabRegisteredCardDefinition> {
  const definitions: Record<string, FabRegisteredCardDefinition> = {};
  for (const cardId of new Set(Object.values(cardsMaps.cardInstances))) {
    const def = resolveFabEngineCardDefinition(cardId);
    if (!def) continue;
    definitions[cardId] = def;
    if (def.canonicalId) definitions[def.canonicalId] = def;
    if (def.slug) definitions[def.slug] = def;
  }
  return definitions;
}

async function buildFabEngineCardDefinitionsWithStructuredCards(
  cardsMaps: CardsMaps,
): Promise<Record<string, FabRegisteredCardDefinition>> {
  const definitions = buildFabEngineCardDefinitions(cardsMaps);
  const structured = await loadFleshAndBloodStructuredCards([
    ...new Set(Object.values(cardsMaps.cardInstances)),
  ]);
  const structuredByCanonicalId = new Map<string, FabRegisteredCardDefinition>();
  for (const [programKey, definition] of structured) {
    let registered = structuredByCanonicalId.get(definition.canonicalId);
    if (!registered) {
      registered = toFabCardDefinition(definition);
      structuredByCanonicalId.set(definition.canonicalId, registered);
    }
    definitions[programKey] = registered;
    definitions[registered.canonicalId] = registered;
    if (registered.slug) definitions[registered.slug] = registered;
  }
  for (const requestedAlias of new Set(Object.values(cardsMaps.cardInstances))) {
    const canonicalId = getFleshAndBloodCard(requestedAlias)?.canonicalId;
    const registered = canonicalId ? structuredByCanonicalId.get(canonicalId) : undefined;
    if (registered) definitions[requestedAlias] = registered;
  }
  return definitions;
}

/**
 * Create a freshly-initialised Flesh and Blood server engine from the play
 * module's generic create-input.
 */
export async function fleshAndBloodCreateServerEngine(
  input: ServerEngineCreateInput,
): Promise<ServerGameEngine> {
  const cardDefinitions = await buildFabEngineCardDefinitionsWithStructuredCards(input.cardsMaps);
  const heroes: Record<string, string> = {};
  const deckInstanceIds: Record<string, string[]> = {};
  const inventoryInstanceIds: Record<string, string[]> = {};
  const startingArena: Record<
    string,
    Partial<Record<"head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2", string[]>>
  > = {};
  const heroInstanceIds: string[] = [];
  for (const [playerId, instanceIds] of Object.entries(input.cardsMaps.owners)) {
    const heroInstanceId = instanceIds.find((instanceId) => {
      const cardId = input.cardsMaps.cardInstances[instanceId];
      return cardId ? hasType(cardDefinitions[cardId], "Hero") : false;
    });
    if (heroInstanceId) {
      heroInstanceIds.push(heroInstanceId);
      const heroCardId = input.cardsMaps.cardInstances[heroInstanceId];
      if (heroCardId) heroes[playerId] = heroCardId;
    }
    const classified = classifyFabStartingCards(
      instanceIds.filter((instanceId) => instanceId !== heroInstanceId),
      input.cardsMaps.cardInstances,
      cardDefinitions,
      input.cardsMaps.instanceSections,
    );
    inventoryInstanceIds[playerId] = classified.inventory;
    deckInstanceIds[playerId] = classified.deck;
    startingArena[playerId] = classified.arena;
  }
  const matchInstanceIds = new Set([
    ...heroInstanceIds,
    ...Object.values(deckInstanceIds).flat(),
    ...Object.values(inventoryInstanceIds).flat(),
    ...Object.values(startingArena).flatMap((zones) => Object.values(zones).flat()),
  ]);
  const { automationPreferences, optionalTriggerDeclines, optionalTriggerAccepts } =
    narrowPriorityAutomationSeed(input.automation);
  const state = createFabMatchInitialState({
    seed: input.seed,
    player1Id: input.player1Id,
    player2Id: input.player2Id,
    cardsMaps: {
      canonicalIdsByInstance: Object.fromEntries(
        Object.entries(input.cardsMaps.cardInstances).filter(([instanceId]) =>
          matchInstanceIds.has(instanceId),
        ),
      ),
      owners: input.cardsMaps.owners,
    },
    deckInstanceIds,
    inventoryInstanceIds,
    startingArena,
    firstPlayerId: input.firstTurnPlayerId ?? input.firstPlayerChooserId,
    cardDefinitions,
    publicCardIdentities: fleshAndBloodPublicCardIdentities,
    heroes,
    automationPreferences,
    optionalTriggerDeclines,
    optionalTriggerAccepts,
  });
  const runtime = new FabMatchRuntime(state);
  const activeId = new FleshAndBloodServerEngine(runtime).getActivePlayerId();
  return new FleshAndBloodServerEngine(
    runtime,
    createFabClock(input.timeControl, runtime.playerIds(), activeId, Date.now()),
  );
}

/**
 * Narrow the opaque contract seed (`ServerEngineCreateInput.automation`) to
 * the engine's automation inputs. A seat holds either the legacy bare mode
 * string (mode only) or the structured value emitted by the settings
 * provider: `{ priorityMode, autoOrderTriggers, autoSelectSingletonTargets,
 * playAndSkipHoldCardIds, opponentTriggerYieldCardIds, optionalTriggerDeclines }`.
 * Unrecognized
 * fields drop silently; a seat with no valid priority mode is omitted
 * entirely, which the engine reads as its fail-closed defaults.
 */
function narrowPriorityAutomationSeed(automation: Readonly<Record<string, unknown>> | undefined): {
  automationPreferences: Partial<
    Record<string, Partial<import("@tcg/flesh-and-blood-engine/runtime").FabAutomationPreferences>>
  >;
  optionalTriggerDeclines: Partial<Record<string, Readonly<Record<string, true>>>>;
  optionalTriggerAccepts: Partial<Record<string, Readonly<Record<string, true>>>>;
} {
  const automationPreferences: NonNullable<
    ReturnType<typeof narrowPriorityAutomationSeed>["automationPreferences"]
  > = {};
  const optionalTriggerDeclines: Partial<Record<string, Readonly<Record<string, true>>>> = {};
  const optionalTriggerAccepts: Partial<Record<string, Readonly<Record<string, true>>>> = {};
  if (!automation)
    return { automationPreferences, optionalTriggerDeclines, optionalTriggerAccepts };
  for (const [seatId, value] of Object.entries(automation)) {
    if (value === "auto-pass" || value === "always-hold" || value === "play-and-skip") {
      automationPreferences[seatId] = { priorityMode: value };
      continue;
    }
    if (!isRecord(value)) continue;
    const mode = value["priorityMode"];
    if (mode !== "auto-pass" && mode !== "always-hold" && mode !== "play-and-skip") continue;
    const stringList = (key: string): readonly string[] | undefined => {
      const ids = value[key];
      if (!Array.isArray(ids)) return undefined;
      const valid = ids.filter((id): id is string => typeof id === "string" && id.length > 0);
      return valid.length > 0 ? valid : undefined;
    };
    automationPreferences[seatId] = {
      priorityMode: mode,
      ...(typeof value["autoOrderTriggers"] === "boolean"
        ? { autoOrderTriggers: value["autoOrderTriggers"] as boolean }
        : {}),
      ...(typeof value["autoSelectSingletonTargets"] === "boolean"
        ? { autoSelectSingletonTargets: value["autoSelectSingletonTargets"] as boolean }
        : {}),
      ...(stringList("playAndSkipHoldCardIds")
        ? { playAndSkipHoldCardIds: stringList("playAndSkipHoldCardIds") }
        : {}),
      ...(stringList("opponentTriggerYieldCardIds")
        ? { opponentTriggerYieldCardIds: stringList("opponentTriggerYieldCardIds") }
        : {}),
    };
    const declines = value["optionalTriggerDeclines"];
    if (Array.isArray(declines)) {
      const canonicalIds: Record<string, true> = {};
      for (const canonicalId of declines) {
        if (typeof canonicalId === "string" && canonicalId.length > 0) {
          canonicalIds[canonicalId] = true;
        }
      }
      if (Object.keys(canonicalIds).length > 0) {
        optionalTriggerDeclines[seatId] = canonicalIds;
      }
    }
    const accepts = value["optionalTriggerAccepts"];
    if (Array.isArray(accepts)) {
      const canonicalIds: Record<string, true> = {};
      for (const canonicalId of accepts) {
        if (typeof canonicalId === "string" && canonicalId.length > 0) {
          canonicalIds[canonicalId] = true;
        }
      }
      if (Object.keys(canonicalIds).length > 0) {
        optionalTriggerAccepts[seatId] = canonicalIds;
      }
    }
  }
  return { automationPreferences, optionalTriggerDeclines, optionalTriggerAccepts };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasType(definition: FabRegisteredCardDefinition | undefined, type: string): boolean {
  if (!definition) return false;
  const typeBox = definition.base.typeBox;
  return [...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes].some(
    (entry) => entry.toLowerCase() === type.toLowerCase(),
  );
}

/**
 * Classify the finalized FAB ownership map into the private starting deck and
 * the public arena zones chosen during CR 4.1.4. Any surplus arena-card stays
 * in the player's private inventory; it is intentionally neither shuffled nor
 * exposed through match state.
 */
export function classifyFabStartingCards(
  instanceIds: readonly string[],
  cardInstances: Readonly<Record<string, string>>,
  definitions: Readonly<Record<string, FabRegisteredCardDefinition>>,
  sections: Readonly<Record<string, string>> = {},
): {
  deck: string[];
  arena: Partial<Record<"head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2", string[]>>;
  inventory: string[];
} {
  const deck: string[] = [];
  const inventory: string[] = [];
  const arena: Partial<
    Record<"head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2", string[]>
  > = {};
  const weaponZoneCandidates: Array<{
    instanceId: string;
    definition: FabRegisteredCardDefinition;
  }> = [];

  for (const instanceId of instanceIds) {
    const section = sections[instanceId];
    if (section === "inventory") {
      inventory.push(instanceId);
      continue;
    }
    if (section === "main") {
      deck.push(instanceId);
      continue;
    }
    if (
      section === "head" ||
      section === "chest" ||
      section === "arms" ||
      section === "legs" ||
      section === "weapon1" ||
      section === "weapon2"
    ) {
      arena[section] = [instanceId];
      continue;
    }
    const cardId = cardInstances[instanceId];
    const definition = cardId ? definitions[cardId] : undefined;
    if (!definition) {
      deck.push(instanceId);
      continue;
    }
    const bodySlot = (["head", "chest", "arms", "legs"] as const).find((slot) =>
      hasType(definition, slot),
    );
    if (bodySlot) {
      if (!arena[bodySlot]) arena[bodySlot] = [instanceId];
      else inventory.push(instanceId);
      continue;
    }
    if (
      hasType(definition, "Weapon") ||
      hasType(definition, "Off-Hand") ||
      hasType(definition, "Quiver")
    ) {
      weaponZoneCandidates.push({ instanceId, definition });
      continue;
    }
    if (hasType(definition, "Equipment")) {
      inventory.push(instanceId);
      continue;
    }
    deck.push(instanceId);
  }

  const twoHanded = weaponZoneCandidates.find(({ definition }) => hasType(definition, "2H"));
  if (twoHanded) {
    arena.weapon1 = [twoHanded.instanceId];
    inventory.push(
      ...weaponZoneCandidates
        .filter(({ instanceId }) => instanceId !== twoHanded.instanceId)
        .map(({ instanceId }) => instanceId),
    );
  } else {
    const orderedCandidates = weaponZoneCandidates.toSorted(
      (left, right) =>
        Number(hasType(right.definition, "Weapon")) - Number(hasType(left.definition, "Weapon")),
    );
    for (const { instanceId } of orderedCandidates) {
      if (!arena.weapon1) arena.weapon1 = [instanceId];
      else if (!arena.weapon2) arena.weapon2 = [instanceId];
      else inventory.push(instanceId);
    }
  }
  return { deck, arena, inventory };
}

/**
 * Build the persistence envelope from a Flesh and Blood engine.
 */
export function fleshAndBloodSerializeEngine(
  engine: ServerGameEngine,
  cardsMaps: CardsMaps,
): EngineSnapshot {
  const fab = unwrap(engine);
  return {
    gameSlug: "flesh-and-blood",
    state: fab.getState(),
    historyLength: 0,
    cardsMaps,
  };
}

/**
 * Recreate a Flesh and Blood engine from a previously serialised snapshot.
 */
export async function fleshAndBloodRestoreEngine(
  snapshot: EngineSnapshot,
  _context: ServerEngineRestoreContext,
): Promise<ServerGameEngine> {
  const cardsMaps = fleshAndBloodExtractCardsMapsFromSnapshot(snapshot);
  const context = createFabMatchContext(
    await buildFabEngineCardDefinitionsWithStructuredCards(cardsMaps),
    fleshAndBloodPublicCardIdentities,
  );
  const clock = readFabClock(snapshot.state);
  const nativeState =
    snapshot.state && typeof snapshot.state === "object" && "ctx" in snapshot.state
      ? (({ ctx: _clock, ...state }) => state)(snapshot.state)
      : snapshot.state;
  return new FleshAndBloodServerEngine(
    new FabMatchRuntime(restoreFabMatchSnapshot(nativeState, context)),
    clock,
  );
}

/** Flesh and Blood implementation of `extractCardsMapsFromSnapshot`. */
export function fleshAndBloodExtractCardsMapsFromSnapshot(snapshot: EngineSnapshot): CardsMaps {
  return snapshot.cardsMaps ?? { cardInstances: {}, owners: {} };
}

function unwrap(engine: ServerGameEngine): FleshAndBloodServerEngine {
  if (engine instanceof FleshAndBloodServerEngine) return engine;
  throw new Error(
    "Flesh and Blood adapter received a ServerGameEngine that is not a FleshAndBloodServerEngine. " +
      "This indicates a wiring bug in the game-server.",
  );
}
