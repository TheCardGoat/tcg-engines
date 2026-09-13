/**
 * Resolve tournament deck selections into engine seat fixtures.
 *
 * Format-legal tournament text fixtures resolve against
 * `@tcg/flesh-and-blood-cards` by printed name + pitch color, then apply the
 * default pregame equipment selection. Unselected equipment stays in inventory.
 */
import { fleshAndBloodDeckCardLibrary } from "@tcg/flesh-and-blood-cards/deck-library";
import {
  getFabCardCategory,
  isFabDeckCard,
  isFabEquippableArenaCard,
} from "@tcg/flesh-and-blood-types";
import {
  getFabDeckTextFixture,
  createDefaultFabPregameSelection,
  resolveFabEquipmentSelection,
  seedFromString,
  shuffleWith,
  toFabCardDefinition,
  type FabRegisteredCardDefinition,
  type FabDeckFormat,
  type FabDeckTextFixture,
  type FabPregameCardPool,
  type FabPregameSelection,
} from "@tcg/flesh-and-blood-engine/simulator";
import type { FabPlayerFixture } from "@tcg/flesh-and-blood-engine/testing";
import { flattenDeckDocument, type DeckDocument } from "@tcg/game-page-contract/deck-document";

import {
  FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL,
  type FabPracticeDeckFormatGroup,
} from "./practice-deck-options";

const OPENING_HAND_SIZE = 4;

const PITCH_TO_VALUE = {
  red: 1,
  yellow: 2,
  blue: 3,
} as const;

export type FabDeckTextPitch = keyof typeof PITCH_TO_VALUE;

export interface ParsedFabDeckTextLine {
  readonly count: number;
  readonly name: string;
  readonly pitch?: FabDeckTextPitch;
}

export interface ResolvedPracticeSeat {
  readonly deckId: string;
  readonly label: string;
  readonly formatGroup: FabPracticeDeckFormatGroup;
  readonly formatLabel: string;
  readonly player: FabPlayerFixture;
  readonly cardDefinitions: Record<string, FabRegisteredCardDefinition>;
  /** Full private card pool retained until the player locks pregame choices. */
  readonly cardPool: FabPregameCardPool;
  /** Printed names that did not resolve in the catalog (arena / main deck). */
  readonly unresolved: readonly string[];
}

function countPoolEntries(
  cardIds: readonly string[],
  source: "equipment" | "main" | "inventory",
): FabPregameCardPool["entries"] {
  const counts = new Map<string, number>();
  for (const canonicalId of cardIds) counts.set(canonicalId, (counts.get(canonicalId) ?? 0) + 1);
  return [...counts].map(([canonicalId, quantity]) => ({ canonicalId, quantity, source }));
}

type ResolvedCatalogCard = (typeof fleshAndBloodDeckCardLibrary)[number];
const RESOLVED_CARDS = fleshAndBloodDeckCardLibrary;

function buildCardsByName(): ReadonlyMap<string, readonly ResolvedCatalogCard[]> {
  const byName = new Map<string, ResolvedCatalogCard[]>();
  for (const card of RESOLVED_CARDS) {
    if (!card.name) continue;
    const existing = byName.get(card.name);
    if (existing) existing.push(card);
    else byName.set(card.name, [card]);
  }
  return byName;
}

const CARDS_BY_NAME = buildCardsByName();
const CARDS_BY_CANONICAL_ID = new Map(
  RESOLVED_CARDS.map((card) => [card.canonicalId, card] as const),
);

export function parseFabDeckTextLine(line: string): ParsedFabDeckTextLine | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const match = trimmed.match(/^(\d+)x\s+(.+?)(?:\s+\((red|yellow|blue)\))?$/i);
  if (!match) return null;
  const rawPitch = match[3]?.toLowerCase();
  const pitch =
    rawPitch === "red" || rawPitch === "yellow" || rawPitch === "blue" ? rawPitch : undefined;
  return {
    count: Number.parseInt(match[1]!, 10),
    name: match[2]!.trim().replace(/\s*\|\|\s*/g, " // "),
    pitch,
  };
}

export function resolveCatalogCardByName(
  name: string,
  pitch?: FabDeckTextPitch,
): ResolvedCatalogCard | undefined {
  const candidates = CARDS_BY_NAME.get(name);
  if (!candidates?.length) return undefined;
  if (!pitch) {
    return (
      candidates.find((card) => getFabCardCategory(card.runtime.base.typeBox) === "hero") ??
      candidates[0]
    );
  }
  const value = PITCH_TO_VALUE[pitch];
  // A missing requested color is unresolved, never silently substituted with
  // another pitch. Pitch is a printed card property and determines resources.
  return candidates.find((card) => card.runtime.base.numeric.pitch === value);
}

function hasType(card: ResolvedCatalogCard, typeName: string): boolean {
  const typeBox = card.runtime.base.typeBox;
  return [...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes].some(
    (entry) => entry.toLowerCase() === typeName.toLowerCase(),
  );
}

interface ArenaSlots {
  head?: string;
  chest?: string;
  arms?: string;
  legs?: string;
  weapon1?: string;
  weapon2?: string;
  /** A (2H) weapon occupies both weapon zones but has one card instance. */
  weapon2Reserved?: true;
  arena: string[];
}

/** First-fit equipment into hero zones; overflow and items land in arena. */
export function seatFabArenaCard(card: ResolvedCatalogCard, slots: ArenaSlots): void {
  const id = card.canonicalId;
  if (hasType(card, "Weapon") && !hasType(card, "Off-Hand")) {
    if (hasType(card, "2H")) {
      if (!slots.weapon1 && !slots.weapon2 && !slots.weapon2Reserved) {
        slots.weapon1 = id;
        slots.weapon2Reserved = true;
      } else slots.arena.push(id);
      return;
    }
    if (!slots.weapon1) slots.weapon1 = id;
    else if (!slots.weapon2 && !slots.weapon2Reserved) slots.weapon2 = id;
    else slots.arena.push(id);
    return;
  }
  if (hasType(card, "Off-Hand")) {
    if (!slots.weapon2 && !slots.weapon2Reserved) slots.weapon2 = id;
    else slots.arena.push(id);
    return;
  }
  if (hasType(card, "Head")) {
    if (!slots.head) slots.head = id;
    else slots.arena.push(id);
    return;
  }
  if (hasType(card, "Chest")) {
    if (!slots.chest) slots.chest = id;
    else slots.arena.push(id);
    return;
  }
  if (hasType(card, "Arms")) {
    if (!slots.arms) slots.arms = id;
    else slots.arena.push(id);
    return;
  }
  if (hasType(card, "Legs")) {
    if (!slots.legs) slots.legs = id;
    else slots.arena.push(id);
    return;
  }
  slots.arena.push(id);
}

export function registerFabCatalogDefinition(
  card: ResolvedCatalogCard,
  into: Record<string, FabRegisteredCardDefinition>,
): void {
  into[card.canonicalId] = toFabCardDefinition(card.runtime);
}

function formatGroupForTextFormat(format: FabDeckFormat): FabPracticeDeckFormatGroup {
  switch (format) {
    case "classic-constructed":
      return "classic-constructed";
    case "silver-age":
      return "silver-age";
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}

function resolveTextFixture(deck: FabDeckTextFixture, seed: string): ResolvedPracticeSeat {
  const cardDefinitions: Record<string, FabRegisteredCardDefinition> = {};
  const unresolved: string[] = [];
  let heroId: string | undefined;
  let heroLife = 20;
  const mainDeckIds: string[] = [];
  const equipmentPoolIds: string[] = [];

  const heroCard = resolveCatalogCardByName(deck.hero);
  if (!heroCard) {
    unresolved.push(deck.hero);
  } else {
    heroId = heroCard.canonicalId;
    heroLife = heroCard.runtime.base.numeric.life ?? 20;
    registerFabCatalogDefinition(heroCard, cardDefinitions);
  }

  for (const line of deck.arena.split("\n")) {
    const parsed = parseFabDeckTextLine(line);
    if (!parsed) continue;
    const card = resolveCatalogCardByName(parsed.name, parsed.pitch);
    if (!card) {
      unresolved.push(parsed.pitch ? `${parsed.name} (${parsed.pitch})` : parsed.name);
      continue;
    }
    registerFabCatalogDefinition(card, cardDefinitions);
    for (let i = 0; i < parsed.count; i++) equipmentPoolIds.push(card.canonicalId);
  }

  for (const line of deck.mainDeck.split("\n")) {
    const parsed = parseFabDeckTextLine(line);
    if (!parsed) continue;
    const card = resolveCatalogCardByName(parsed.name, parsed.pitch);
    if (!card) {
      unresolved.push(parsed.pitch ? `${parsed.name} (${parsed.pitch})` : parsed.name);
      continue;
    }
    registerFabCatalogDefinition(card, cardDefinitions);
    for (let i = 0; i < parsed.count; i++) mainDeckIds.push(card.canonicalId);
  }

  if (!heroId) {
    throw new Error(`Could not resolve hero for deck “${deck.id}”: ${deck.hero}`);
  }
  if (unresolved.length > 0) {
    throw new Error(`Deck “${deck.id}” has unresolved catalog cards: ${unresolved.join(", ")}`);
  }

  const formatGroup = formatGroupForTextFormat(deck.format);
  const cardPool: FabPregameCardPool = {
    format: deck.format === "classic-constructed" ? "cc" : "silverAge",
    heroId,
    entries: [
      ...countPoolEntries(equipmentPoolIds, "equipment"),
      ...countPoolEntries(mainDeckIds, "main"),
    ],
    cardDefinitions,
  };
  const selection = createDefaultFabPregameSelection(cardPool);
  const player = materializeFabPracticeSeat({ cardPool, cardDefinitions }, selection, seed);

  return {
    deckId: deck.id,
    label: deck.name,
    formatGroup,
    formatLabel: FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL[formatGroup],
    unresolved,
    cardDefinitions,
    cardPool,
    player: {
      ...player,
      life: heroLife,
    },
  };
}

/** Resolve a practice picker id to a format-legal tournament text fixture. */
export function resolvePracticeDeckSelection(deckId: string, seed: string): ResolvedPracticeSeat {
  const text = getFabDeckTextFixture(deckId);
  if (text) return resolveTextFixture(text, seed);

  throw new Error(`Unknown practice deck id: ${deckId}`);
}

/** Resolve a typed platform deck document into a real FAB player seat. */
export function resolveFabPracticeDeckDocument(
  document: DeckDocument,
  seed: string,
): ResolvedPracticeSeat {
  if (document.game !== "flesh-and-blood")
    throw new Error("Practice deck is not a Flesh and Blood deck.");
  if (document.schemaVersion !== 2) {
    throw new Error("Flesh and Blood practice requires a new V2 deck document.");
  }
  if (
    document.formatId !== "cc" &&
    document.formatId !== "blitz" &&
    document.formatId !== "silverAge" &&
    document.formatId !== "ll"
  ) {
    throw new Error("Practice deck has an unsupported Flesh and Blood format.");
  }
  const entries = flattenDeckDocument(document);
  const heroEntries = entries.filter((entry) => entry.sectionId === "hero");
  if (heroEntries.length !== 1 || heroEntries[0]?.quantity !== 1) {
    throw new Error("Practice deck requires exactly one Hero.");
  }
  const heroCard = CARDS_BY_CANONICAL_ID.get(heroEntries[0].canonicalId);
  if (!heroCard || getFabCardCategory(heroCard.runtime.base.typeBox) !== "hero")
    throw new Error("Practice deck Hero could not be resolved.");
  const cardDefinitions: Record<string, FabRegisteredCardDefinition> = {};
  registerFabCatalogDefinition(heroCard, cardDefinitions);
  const resolveCardPool = (): FabPregameCardPool["entries"] => {
    const equipment: string[] = [];
    const deckCards: string[] = [];
    const inventory: string[] = [];
    for (const entry of entries.filter((candidate) => candidate.sectionId === "cardPool")) {
      const card = CARDS_BY_CANONICAL_ID.get(entry.canonicalId);
      if (!card) throw new Error(`Practice deck card could not be resolved: ${entry.canonicalId}.`);
      if (getFabCardCategory(card.runtime.base.typeBox) === "hero")
        throw new Error(`Practice card pool contains a Hero: ${card.name}.`);
      registerFabCatalogDefinition(card, cardDefinitions);
      for (let index = 0; index < entry.quantity; index += 1) {
        const typeBox = card.runtime.base.typeBox;
        if (isFabEquippableArenaCard(typeBox, card.runtime.base.keywords)) {
          equipment.push(card.canonicalId);
        } else if (isFabDeckCard(typeBox)) deckCards.push(card.canonicalId);
        else if (getFabCardCategory(typeBox) === "arena") inventory.push(card.canonicalId);
        else throw new Error(`Practice card pool contains an unsupported card: ${card.name}.`);
      }
    }
    return [
      ...countPoolEntries(equipment, "equipment"),
      ...countPoolEntries(deckCards, "main"),
      ...countPoolEntries(inventory, "inventory"),
    ];
  };
  const cardPool: FabPregameCardPool = {
    format: document.formatId,
    heroId: heroCard.canonicalId,
    entries: resolveCardPool(),
    cardDefinitions,
  };
  const player = materializeFabPracticeSeat(
    { cardPool, cardDefinitions },
    createDefaultFabPregameSelection(cardPool),
    seed,
  );
  return {
    deckId: `document:${document.name ?? "deck"}`,
    label: document.name ?? "Practice deck",
    formatGroup:
      document.formatId === "cc"
        ? "classic-constructed"
        : document.formatId === "silverAge"
          ? "silver-age"
          : document.formatId === "ll"
            ? "living-legend"
            : "blitz",
    formatLabel:
      document.formatId === "cc"
        ? "Classic Constructed"
        : document.formatId === "silverAge"
          ? "Silver Age"
          : document.formatId === "ll"
            ? "Living Legend"
            : "Blitz",
    unresolved: [],
    cardDefinitions,
    cardPool,
    player,
  };
}

/** Materialize a locked pregame choice into the engine's player fixture. */
export function materializeFabPracticeSeat(
  resolved: Pick<ResolvedPracticeSeat, "cardPool" | "cardDefinitions">,
  selection: FabPregameSelection,
  seed: string,
): FabPlayerFixture {
  const equipment = resolveFabEquipmentSelection(resolved.cardPool, selection.equipment);
  if (equipment.status === "rejected")
    throw new Error(equipment.issues.map((issue) => issue.message).join(" "));
  const deckIds = selection.deck.flatMap((entry) =>
    Array.from({ length: entry.quantity }, () => entry.canonicalId),
  );
  const shuffled = shuffleWith(deckIds, seedFromString(`${seed}:pregame-deck`)).array;
  const hero = resolved.cardDefinitions[resolved.cardPool.heroId];
  const zone = (slot: keyof FabPregameSelection["equipment"]): string[] | undefined => {
    const canonicalId = equipment.equipment[slot];
    return canonicalId ? [canonicalId] : undefined;
  };
  const remaining = new Map<string, number>();
  for (const entry of resolved.cardPool.entries)
    remaining.set(entry.canonicalId, (remaining.get(entry.canonicalId) ?? 0) + entry.quantity);
  for (const cardId of [
    ...deckIds,
    ...Object.values(equipment.equipment).filter((id): id is string => Boolean(id)),
  ]) {
    remaining.set(cardId, (remaining.get(cardId) ?? 0) - 1);
  }
  return {
    heroCardId: resolved.cardPool.heroId,
    life: hero?.base.numeric.life ?? 20,
    hand: shuffled.slice(0, hero?.base.numeric.intellect ?? OPENING_HAND_SIZE),
    deck: shuffled.slice(hero?.base.numeric.intellect ?? OPENING_HAND_SIZE),
    inventory: [...remaining].flatMap(([id, count]) =>
      Array.from({ length: Math.max(0, count) }, () => id),
    ),
    head: zone("head"),
    chest: zone("chest"),
    arms: zone("arms"),
    legs: zone("legs"),
    weapon1: zone("weapon1"),
    weapon2: zone("weapon2"),
  };
}
