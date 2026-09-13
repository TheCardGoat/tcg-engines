import { fleshAndBloodPresentationAdapter } from "./presentation.ts";
import { allFleshAndBloodCards, getFleshAndBloodCard } from "@tcg/flesh-and-blood-cards/catalog";
import { fabDefaultPrintingId } from "@tcg/flesh-and-blood-cards";
import { validateFabDeckConstruction, type FabValidationCode } from "./deck-validation.ts";
import { createFabValidationCard } from "./deck-validation-card.ts";
import { FleshAndBloodGameSettingsSchema } from "@tcg/game-page-contract/settings";
import type {
  CardSummary,
  CardsMaps,
  DeckBuildInput,
  DeckCard,
  DeckFormatResult,
  GameAdapter,
  JsonValue,
  PregameDeckInput,
} from "@tcg/shared/game-adapter";
import { parseJsonValue } from "@tcg/shared/game-adapter";
import {
  createDefaultFabPregameSelection,
  FAB_FORMAT_RULES,
  isFabArenaCardDefinition,
  reconcileFabPregameSelection,
  resolveFabEquipmentSelection,
  validateFabPregameSelection,
  type FabPregameFormat,
  type FabPregameCardPool,
  type FabPriorityAutomationMode,
  type FabRegisteredCardDefinition,
} from "@tcg/flesh-and-blood-engine/runtime";
import { z } from "zod";
import {
  fleshAndBloodCreateServerEngine,
  fleshAndBloodExtractCardsMapsFromSnapshot,
  fleshAndBloodRestoreEngine,
  fleshAndBloodSerializeEngine,
} from "./engine-lifecycle.ts";
import { resolveFabEngineCardDefinition } from "./engine-lifecycle.ts";
import { fleshAndBloodMetadataAdapter } from "./metadata.ts";
import { fleshAndBloodDeckInterchangeAdapter } from "./deck-interchange.ts";
import { fleshAndBloodPracticeDecks } from "./deck-presets.ts";

/** Resolve any card id to its stable canonical id (no-op when already canonical). */
function canonicalCardId(cardId: string): string {
  return getFleshAndBloodCard(cardId)?.canonicalId ?? cardId;
}

/** Formats recognised by Flesh and Blood legality flags (boilerplate validation). */
const FAB_FORMAT_IDS = [
  "blitz",
  "cc",
  "commoner",
  "draft",
  "ll",
  "shapeshifter",
  "silverAge",
  "upf",
] as const;
const FAB_PREGAME_FORMAT_IDS = ["cc", "silverAge", "ll", "blitz", "shapeshifter"] as const;

function pregameFormat(formatId: string): FabPregameFormat {
  switch (formatId) {
    case "cc":
    case "silverAge":
    case "ll":
    case "blitz":
    case "shapeshifter":
      return formatId;
    default:
      throw new Error(`FAB pregame is not configured for format: ${formatId}`);
  }
}

type CatalogCard = NonNullable<ReturnType<typeof getFleshAndBloodCard>>;

/**
 * The printing every surface should advertise when none is chosen: the
 * atelier/save default (best-quality source), falling back to the first
 * catalog printing when nothing ranks.
 */
function defaultFabPrinting(card: CatalogCard) {
  const printingId = fabDefaultPrintingId(card) ?? card.printings[0]?.id;
  return printingId ? card.printings.find((p) => p.id === printingId) : undefined;
}

function runtimeCard(card: CatalogCard): FabRegisteredCardDefinition | undefined {
  return resolveFabEngineCardDefinition(card.canonicalId);
}

function hasDefinitionType(
  definition: FabRegisteredCardDefinition | undefined,
  type: string,
): boolean {
  if (!definition) return false;
  const typeBox = definition.base.typeBox;
  return [...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes].some(
    (candidate) => candidate.toLowerCase() === type.toLowerCase(),
  );
}

function hasCatalogType(card: CatalogCard, type: string): boolean {
  return hasDefinitionType(runtimeCard(card), type);
}

const PERSISTED_FAB_POOL_SCHEMA = z
  .object({
    schemaVersion: z.literal(2),
    printingAllocations: z.array(
      z
        .object({
          canonicalId: z.string().min(1),
          printingId: z.string().min(1),
          quantity: z.number().int().positive(),
        })
        .strict(),
    ),
    format: z.enum(["cc", "silverAge", "ll", "blitz", "shapeshifter"]),
    heroId: z.string().min(1),
    heroName: z.string().min(1),
    entries: z.array(
      z
        .object({
          canonicalId: z.string().min(1),
          quantity: z.number().int().positive(),
          source: z.enum(["equipment", "main", "inventory"]),
        })
        .strict(),
    ),
  })
  .strict();

const FAB_PREGAME_SELECTION_SCHEMA = z
  .object({
    equipment: z
      .object({
        head: z.string().min(1).optional(),
        chest: z.string().min(1).optional(),
        arms: z.string().min(1).optional(),
        legs: z.string().min(1).optional(),
        weapon1: z.string().min(1).optional(),
        weapon2: z.string().min(1).optional(),
      })
      .strict(),
    deck: z.array(
      z
        .object({
          canonicalId: z.string().min(1),
          quantity: z.number().int().positive(),
        })
        .strict(),
    ),
  })
  .strict();

type PersistedFabPregamePool = z.infer<typeof PERSISTED_FAB_POOL_SCHEMA>;
type PersistedFabPregameSelection = z.infer<typeof FAB_PREGAME_SELECTION_SCHEMA>;

function parsePool(value: unknown): PersistedFabPregamePool {
  const parsed = PERSISTED_FAB_POOL_SCHEMA.safeParse(value);
  if (!parsed.success) throw new Error("Invalid persisted FAB pregame card pool");
  const expected = new Map<string, number>([[parsed.data.heroId, 1]]);
  for (const entry of parsed.data.entries)
    expected.set(entry.canonicalId, (expected.get(entry.canonicalId) ?? 0) + entry.quantity);
  for (const allocation of parsed.data.printingAllocations) {
    const remaining = expected.get(allocation.canonicalId);
    if (remaining === undefined || remaining < allocation.quantity)
      throw new Error("Invalid FAB printing allocation");
    expected.set(allocation.canonicalId, remaining - allocation.quantity);
  }
  if ([...expected.values()].some((quantity) => quantity !== 0))
    throw new Error("Incomplete FAB printing allocations");
  return parsed.data;
}

function parseSelection(value: unknown): PersistedFabPregameSelection {
  const parsed = FAB_PREGAME_SELECTION_SCHEMA.safeParse(value);
  if (!parsed.success) throw new Error("Invalid persisted FAB pregame selection");
  return parsed.data;
}

function hydratePool(value: unknown): FabPregameCardPool {
  const pool = parsePool(value);
  const canonicalIds = new Set([pool.heroId, ...pool.entries.map((entry) => entry.canonicalId)]);
  const cardDefinitions = Object.fromEntries(
    [...canonicalIds].map((canonicalId) => {
      const definition = resolveFabEngineCardDefinition(canonicalId);
      if (!definition) throw new Error(`Unknown Flesh and Blood card: ${canonicalId}`);
      return [canonicalId, definition];
    }),
  );
  const {
    printingAllocations: _printingAllocations,
    schemaVersion: _schemaVersion,
    ...rulesPool
  } = pool;
  return { ...rulesPool, cardDefinitions };
}

const OMIT_FROM_PLAYER_PROJECTION = Symbol("omit-from-player-projection");

function projectDefinedJson(value: unknown): JsonValue | typeof OMIT_FROM_PLAYER_PROJECTION {
  if (value === undefined) return OMIT_FROM_PLAYER_PROJECTION;
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => {
      const projected = projectDefinedJson(entry);
      if (projected === OMIT_FROM_PLAYER_PROJECTION) {
        throw new Error("FAB player projection cannot contain undefined array entries");
      }
      return projected;
    });
  }
  if (typeof value !== "object" || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error("FAB player projection contains a non-JSON runtime value");
  }
  const projected: Record<string, JsonValue> = {};
  for (const [key, entry] of Object.entries(value)) {
    const next = projectDefinedJson(entry);
    if (next !== OMIT_FROM_PLAYER_PROJECTION) projected[key] = next;
  }
  return projected;
}

function projectPoolForPlayer(pool: JsonValue): JsonValue {
  const projected = projectDefinedJson(hydratePool(pool));
  if (projected === OMIT_FROM_PLAYER_PROJECTION) {
    throw new Error("FAB player pool projection is unavailable");
  }
  return parseJsonValue(projected);
}

function createFabPool(input: PregameDeckInput): PersistedFabPregamePool {
  const heroes: string[] = [];
  const printingAllocations: PersistedFabPregamePool["printingAllocations"] = [];
  const entries = new Map<
    string,
    { canonicalId: string; quantity: number; source: "equipment" | "main" | "inventory" }
  >();
  const add = (
    cardId: string,
    quantity: number,
    board: "main" | "inventory",
    selectedPrintingId?: string,
  ) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`${cardId} must have a positive whole-number quantity.`);
    }
    const definition = resolveFabEngineCardDefinition(cardId);
    if (!definition) throw new Error(`Unknown Flesh and Blood card: ${cardId}`);
    const canonicalId = definition.canonicalId ?? cardId;
    const catalogCard = getFleshAndBloodCard(canonicalId);
    const printingId =
      selectedPrintingId ?? (catalogCard ? defaultFabPrinting(catalogCard)?.id : undefined);
    if (!printingId) throw new Error(`Missing FAB printing: ${canonicalId}`);
    printingAllocations.push({ canonicalId, printingId, quantity });
    if (hasDefinitionType(definition, "Hero")) {
      if (board === "inventory") throw new Error("A hero cannot be included in inventory.");
      if (board === "main") {
        for (let copy = 0; copy < quantity; copy += 1) heroes.push(canonicalId);
      }
      return;
    }
    const source =
      board === "inventory"
        ? "inventory"
        : isFabArenaCardDefinition(definition)
          ? "equipment"
          : "main";
    const key = `${source}:${canonicalId}`;
    const previous = entries.get(key);
    entries.set(key, { canonicalId, quantity: (previous?.quantity ?? 0) + quantity, source });
  };
  for (const entry of input.mainDeck) add(entry.cardId, entry.quantity, "main", entry.printingId);
  for (const entry of input.inventory)
    add(entry.cardId, entry.quantity, "inventory", entry.printingId);
  const uniqueHeroes = [...new Set(heroes)];
  if (heroes.length !== 1 || uniqueHeroes.length !== 1) {
    throw new Error(`Flesh and Blood requires exactly one hero; found ${heroes.length}`);
  }
  const hero = getFleshAndBloodCard(uniqueHeroes[0]!);
  if (!hero) throw new Error(`Unknown Flesh and Blood hero: ${uniqueHeroes[0]}`);
  return PERSISTED_FAB_POOL_SCHEMA.parse({
    schemaVersion: 2,
    printingAllocations,
    format: pregameFormat(input.formatId),
    heroId: uniqueHeroes[0]!,
    heroName: hero.name,
    entries: [...entries.values()],
  });
}

/**
 * The simulator block of the game contract's FaB settings — the only slice
 * the automation seed reads. Validated on its own so unrelated settings
 * garbage (e.g. an unreadable visual payload) cannot fail a seat whose
 * priority mode is still readable.
 */
const FAB_SIMULATOR_SETTINGS_SCHEMA = FleshAndBloodGameSettingsSchema.shape.simulator.unwrap();
const SIMULATOR_FIELD_EXTRACTOR = z.object({ simulator: z.unknown().optional() });

function fabSimulatorSettingsFromGameSettings(gameSettings: unknown):
  | {
      priorityMode?: FabPriorityAutomationMode;
      countdownSpeed?: "fast" | "normal" | "slow";
      autoOrderTriggers?: boolean;
      autoSelectSingletonTargets?: boolean;
      playAndSkipHoldCardIds?: string[];
      opponentTriggerYieldCardIds?: string[];
      optionalTriggerDeclines?: string[];
      optionalTriggerAccepts?: string[];
    }
  | undefined {
  const extracted = SIMULATOR_FIELD_EXTRACTOR.safeParse(gameSettings);
  if (!extracted.success) return undefined;
  const simulator = FAB_SIMULATOR_SETTINGS_SCHEMA.safeParse(extracted.data.simulator);
  if (!simulator.success) return undefined;
  return simulator.data;
}

/**
 * Flesh and Blood {@link GameAdapter}. Mirrors the catalog-resolution pattern
 * used by other games and wires the four server-engine lifecycle methods so
 * the play module can host server-authoritative matches.
 */
export const fleshAndBloodServerAdapter: GameAdapter = {
  practiceDecks: fleshAndBloodPracticeDecks,
  slug: "flesh-and-blood",
  deckInterchange: fleshAndBloodDeckInterchangeAdapter,

  createGameId: () => `flesh-and-blood-game-${crypto.randomUUID()}`,

  generateUserName: (gameProfileId) => `player-${gameProfileId.slice(0, 6)}`,

  presentation: fleshAndBloodPresentationAdapter,

  buildCardInstances(decks: ReadonlyArray<DeckBuildInput>): CardsMaps {
    const cardInstances: Record<string, string> = {};
    const owners: Record<string, string[]> = {};
    const instanceSections: Record<string, string> = {};
    let hasSections = false;
    const printingIdByInstanceId: Record<string, string> = {};
    for (const { owner, deck } of decks) {
      const instances: string[] = [];
      let ordinal = 0;
      for (const { cardId, qty, sectionId, printingId } of deck) {
        for (let copy = 0; copy < qty; copy += 1) {
          const instanceId = `${owner}-${canonicalCardId(cardId)}-${ordinal++}`;
          cardInstances[instanceId] = cardId;
          instances.push(instanceId);
          if (printingId) printingIdByInstanceId[instanceId] = printingId;
          if (sectionId) {
            instanceSections[instanceId] = sectionId;
            hasSections = true;
          }
        }
      }
      owners[owner] = instances;
    }
    return {
      cardInstances,
      owners,
      ...(hasSections ? { instanceSections } : {}),
      ...(Object.keys(printingIdByInstanceId).length
        ? { presentation: { printingIdByInstanceId } }
        : {}),
    };
  },

  getCardById(publicId: string): CardSummary | null {
    const card = getFleshAndBloodCard(publicId);
    if (!card) return null;
    const color = runtimeCard(card)?.base.color;
    // Canonical lookups advertise the same default printing as atelier/save.
    const printing = card.printings.find((p) => p.id === publicId) ?? defaultFabPrinting(card);
    return {
      publicId,
      colors: color ? [color] : [],
      label: card.name,
      // CDN-only payload: first-party printing key, never the upstream URL.
      imageUrl: printing?.imageUrl || null,
    };
  },

  getCanonicalCardId: (publicId) => getFleshAndBloodCard(publicId)?.canonicalId ?? null,

  matchmakingIdentity: {
    getDeckIdentity(deck) {
      const heroes = deck
        .map((entry) => getFleshAndBloodCard(entry.cardId))
        .filter((card): card is CatalogCard => Boolean(card && hasCatalogType(card, "Hero")));
      const hero = heroes[0];
      if (!hero || heroes.length !== 1) return null;
      return {
        id: hero.canonicalId,
        label: hero.name,
        imageUrl: defaultFabPrinting(hero)?.imageUrl || null,
      };
    },
    listOpponentIdentities(formatId) {
      if (!(FAB_PREGAME_FORMAT_IDS as readonly string[]).includes(formatId)) return [];
      const rules = FAB_FORMAT_RULES[pregameFormat(formatId)];
      return allFleshAndBloodCards
        .filter((card) => {
          if (!hasCatalogType(card, "Hero")) return false;
          const isYoung = hasCatalogType(card, "Young");
          if (rules.heroAge === "young" ? !isYoung : isYoung) return false;
          const legality = rules.legalityKey ? card.legalities[rules.legalityKey] : null;
          return !legality || (legality.legal && !legality.banned && !legality.suspended);
        })
        .map((card) => ({
          id: card.canonicalId,
          label: card.name,
          imageUrl: defaultFabPrinting(card)?.imageUrl || null,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
  },

  metadata: fleshAndBloodMetadataAdapter,

  validateDeckForFormat(formatId: string, deck: ReadonlyArray<DeckCard>): DeckFormatResult {
    if (!(FAB_FORMAT_IDS as readonly string[]).includes(formatId)) {
      throw new Error(`Unknown Flesh and Blood format: ${formatId}`);
    }
    if (!(FAB_PREGAME_FORMAT_IDS as readonly string[]).includes(formatId)) {
      return {
        formatId,
        label: formatId.toUpperCase(),
        valid: false,
        rules: [
          {
            kind: "fab-pregame-format",
            passed: false,
            message: `Pregame support is not configured for ${formatId}.`,
          },
        ],
      };
    }
    const format = pregameFormat(formatId);
    const formatRules = FAB_FORMAT_RULES[format];
    try {
      const persistedPool = createFabPool({
        formatId,
        mainDeck: deck.filter((entry) => entry.sectionId !== "inventory"),
        inventory: deck.filter((entry) => entry.sectionId === "inventory"),
      });
      const pool = hydratePool(persistedPool);
      const cards = Object.fromEntries(
        Object.entries(pool.cardDefinitions).map(([id, definition]) => [
          id,
          createFabValidationCard(definition, getFleshAndBloodCard(id)),
        ]),
      );
      const validation = validateFabDeckConstruction({
        mode: "registered",
        format,
        heroId: pool.heroId,
        entries: pool.entries,
        cards,
      });
      const kind = (code: FabValidationCode): string => {
        switch (code) {
          case "cc_adult_hero":
          case "blitz_young_hero":
            return "fab-hero-age";
          case "pool_size":
            return "fab-card-pool-size";
          case "cc_minimum":
          case "blitz_size":
            return "fab-starting-deck-capacity";
          case "format_legal":
            return "fab-format-legality";
          case "copy_limit":
          case "legendary":
            return "fab-copy-limit";
          case "specialization":
            return "fab-specialization";
          case "silver_age_rarity":
            return "fab-rarity";
          case "card_pool":
          case "hero-metatype":
          case "hero_required":
            return "fab-card-pool";
          default:
            return code;
        }
      };
      const failures = validation.issues.map((issue) => ({
        kind: kind(issue.code),
        passed: false,
        message: issue.message,
      }));
      const checkedKinds = [
        "fab-hero-age",
        "fab-card-pool-size",
        "fab-starting-deck-capacity",
        "fab-format-legality",
        "fab-card-pool",
        "fab-copy-limit",
        "fab-specialization",
        "fab-rarity",
      ];
      return {
        formatId,
        label: formatRules.label,
        valid: validation.valid,
        rules: [
          ...failures,
          ...checkedKinds
            .filter((checked) => !failures.some((failure) => failure.kind === checked))
            .map((checked) => ({
              kind: checked,
              passed: true,
              message: "Registered card-pool check passed.",
            })),
        ],
      };
    } catch (error) {
      return {
        formatId,
        label: formatRules.label,
        valid: false,
        rules: [
          {
            kind: "fab-card-pool",
            passed: false,
            message: error instanceof Error ? error.message : String(error),
          },
        ],
      };
    }
  },

  pregame: {
    kind: "flesh-and-blood",
    deadlineMs: 120_000,
    defaultFormatId: "cc",
    createPool: createFabPool,
    parsePool,
    parseSelection,
    projectPoolForPlayer,
    createDefaultSelection: (pool) =>
      parseSelection(createDefaultFabPregameSelection(hydratePool(pool))),
    validateSelection: (pool, selection) =>
      validateFabPregameSelection(hydratePool(pool), parseSelection(selection)),
    reconcileSelection: (pool, selection) => {
      const result = reconcileFabPregameSelection(hydratePool(pool), parseSelection(selection));
      return { ...result, selection: parseSelection(result.selection) };
    },
    materializeDeck: (poolValue, selectionValue) => {
      const pool = hydratePool(poolValue);
      const selection = parseSelection(selectionValue);
      const validation = validateFabPregameSelection(pool, selection);
      if (!validation.valid)
        throw new Error(validation.issues.map((issue) => issue.message).join(" "));
      const resolved = resolveFabEquipmentSelection(pool, selection.equipment);
      if (resolved.status === "rejected")
        throw new Error(resolved.issues.map((issue) => issue.message).join(" "));
      const remaining = new Map<string, number>();
      for (const entry of pool.entries) {
        remaining.set(entry.canonicalId, (remaining.get(entry.canonicalId) ?? 0) + entry.quantity);
      }
      const deck: Array<{ cardId: string; qty: number; sectionId: string }> = [
        { cardId: pool.heroId, qty: 1, sectionId: "hero" },
      ];
      const take = (cardId: string, qty: number, sectionId: string) => {
        remaining.set(cardId, (remaining.get(cardId) ?? 0) - qty);
        deck.push({ cardId, qty, sectionId });
      };
      for (const [slot, cardId] of Object.entries(resolved.equipment)) {
        if (cardId) take(cardId, 1, slot);
      }
      for (const entry of selection.deck) take(entry.canonicalId, entry.quantity, "main");
      for (const [cardId, qty] of remaining) {
        if (qty > 0) deck.push({ cardId, qty, sectionId: "inventory" });
      }
      const allocations = parsePool(poolValue).printingAllocations.map((entry) => ({ ...entry }));
      return deck.flatMap((entry) => {
        let needed = entry.qty;
        const materialized: Array<{
          cardId: string;
          qty: number;
          sectionId: string;
          printingId?: string;
        }> = [];
        for (const allocation of allocations) {
          if (allocation.canonicalId !== entry.cardId || allocation.quantity === 0) continue;
          const qty = Math.min(needed, allocation.quantity);
          if (qty > 0) materialized.push({ ...entry, qty, printingId: allocation.printingId });
          allocation.quantity -= qty;
          needed -= qty;
          if (needed === 0) break;
        }
        if (needed > 0) throw new Error(`Incomplete FAB printing allocation: ${entry.cardId}`);
        return materialized;
      });
    },
  },

  createServerEngine: fleshAndBloodCreateServerEngine,
  serializeEngine: fleshAndBloodSerializeEngine,
  restoreEngine: fleshAndBloodRestoreEngine,
  extractCardsMapsFromSnapshot: fleshAndBloodExtractCardsMapsFromSnapshot,

  automationSeedFromSettings(seats) {
    const seed: Record<string, unknown> = {};
    for (const { seatId, gameSettings } of seats) {
      const simulator = fabSimulatorSettingsFromGameSettings(gameSettings);
      if (!simulator?.priorityMode) continue;
      const declines = dedupeFabTriggerDeclines(simulator.optionalTriggerDeclines);
      const accepts = dedupeFabTriggerDeclines(simulator.optionalTriggerAccepts);
      // Structured seed always: the consolidated profile carries more than
      // the mode, and the engine's narrowing accepts the full shape. Bare
      // legacy strings remain accepted on read for older stamped Meta.
      seed[seatId] = {
        priorityMode: simulator.priorityMode,
        ...(simulator.autoOrderTriggers !== undefined
          ? { autoOrderTriggers: simulator.autoOrderTriggers }
          : {}),
        autoSelectSingletonTargets: simulator.autoSelectSingletonTargets !== false,
        ...(simulator.playAndSkipHoldCardIds?.length
          ? { playAndSkipHoldCardIds: simulator.playAndSkipHoldCardIds }
          : {}),
        ...(simulator.opponentTriggerYieldCardIds?.length
          ? { opponentTriggerYieldCardIds: simulator.opponentTriggerYieldCardIds }
          : {}),
        ...(declines.length > 0 ? { optionalTriggerDeclines: declines } : {}),
        ...(accepts.length > 0 ? { optionalTriggerAccepts: accepts } : {}),
      };
    }
    return Object.keys(seed).length > 0 ? seed : undefined;
  },
};

/** Deduplicate and re-cap the saved decline list; the contract schema already bounds length. */
function dedupeFabTriggerDeclines(declines: readonly string[] | undefined): string[] {
  if (!declines || declines.length === 0) return [];
  return [...new Set(declines)].slice(0, 256);
}
