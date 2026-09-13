/**
 * Seat a tournament text fixture from the official card catalog.
 *
 * Printed names resolve through display records. Structured modules remain
 * the sole source of executable identity, printed properties, and abilities.
 */
import { getFabCardCategory, type FleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import { toFabCardDefinition, type FabCardDefinitionInput } from "../cards.ts";
import {
  createDefaultFabPregameSelection,
  type FabCardPoolEntry,
  type FabPregameCardPool,
  type FabPregameSelection,
} from "../pregame.ts";
import { seedFromString, shuffleWith } from "../random.ts";
import type { FabPlayerFixture } from "../testing/test-fixtures.ts";
import {
  DEFAULT_BOT_DECK_ID,
  DEFAULT_PLAYER_DECK_ID,
  getFabDeckTextFixture,
  type FabDeckTextFixture,
} from "./deck-text-fixtures.ts";

const OPENING_HAND_SIZE = 4;

const PITCH_TO_VALUE = {
  red: 1,
  yellow: 2,
  blue: 3,
  purple: 4,
} as const;

export type FabDeckTextPitch = keyof typeof PITCH_TO_VALUE;

export interface ParsedFabDeckTextLine {
  readonly count: number;
  readonly name: string;
  readonly pitch?: FabDeckTextPitch;
}

export interface ResolvedFabDeckSeat {
  readonly deckId: string;
  readonly label: string;
  readonly format: FabDeckTextFixture["format"];
  readonly player: FabPlayerFixture;
  readonly cardDefinitions: Record<string, FabCardDefinitionInput>;
  readonly unresolved: readonly string[];
}

export interface FabDeckCardRecord {
  readonly canonicalId: string;
  readonly slug: string;
  readonly name: string;
  readonly runtime: FleshAndBloodCard;
}

export type FabDeckCardLibrary = readonly FabDeckCardRecord[];

const cardsByNameCache = new WeakMap<
  FabDeckCardLibrary,
  ReadonlyMap<string, readonly FabDeckCardRecord[]>
>();

function buildCardsByName(
  library: FabDeckCardLibrary,
): ReadonlyMap<string, readonly FabDeckCardRecord[]> {
  const cached = cardsByNameCache.get(library);
  if (cached) return cached;
  const byName = new Map<string, FabDeckCardRecord[]>();
  for (const card of library) {
    if (!card.name) continue;
    const existing = byName.get(card.name);
    if (existing) existing.push(card);
    else byName.set(card.name, [card]);
  }
  cardsByNameCache.set(library, byName);
  return byName;
}

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

function cardsNamed(library: FabDeckCardLibrary, name: string): readonly FabDeckCardRecord[] {
  const exact = buildCardsByName(library).get(name);
  if (exact?.length) return exact;
  const lower = name.toLowerCase();
  const slug = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return library.filter((card) => {
    const cardName = card.name?.toLowerCase();
    return cardName === lower || card.slug === slug;
  });
}

export function resolveCatalogCardByName(
  library: FabDeckCardLibrary,
  name: string,
  pitch?: FabDeckTextPitch,
): FabDeckCardRecord | undefined {
  const candidates = cardsNamed(library, name);
  if (!candidates.length) return undefined;
  if (!pitch) {
    return (
      candidates.find((card) => getFabCardCategory(card.runtime.base.typeBox) === "hero") ??
      candidates[0]
    );
  }
  const value = PITCH_TO_VALUE[pitch];
  // A missing requested color is unresolved, never silently substituted.
  return candidates.find((card) => card.runtime.base.numeric.pitch === value);
}

function hasType(card: FabDeckCardRecord, typeName: string): boolean {
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
  weapon2Reserved?: true;
  arena: string[];
}

export function seatFabArenaCard(card: FabDeckCardRecord, slots: ArenaSlots): void {
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
  card: FabDeckCardRecord,
  into: Record<string, FabCardDefinitionInput>,
): void {
  into[card.canonicalId] = toFabCardDefinition(card.runtime);
}

/** Look up one catalog printing and return its engine definition. */
export function catalogCardDefinition(
  library: FabDeckCardLibrary,
  name: string,
  pitch?: FabDeckTextPitch,
): FabCardDefinitionInput {
  const card = resolveCatalogCardByName(library, name, pitch);
  if (!card) {
    throw new Error(`Catalog has no card named “${name}”${pitch ? ` (${pitch})` : ""}.`);
  }
  const into: Record<string, FabCardDefinitionInput> = {};
  registerFabCatalogDefinition(card, into);
  return into[card.canonicalId]!;
}

function countPoolEntries(
  cardIds: readonly string[],
  source: FabCardPoolEntry["source"],
): FabCardPoolEntry[] {
  const counts = new Map<string, number>();
  for (const canonicalId of cardIds) counts.set(canonicalId, (counts.get(canonicalId) ?? 0) + 1);
  return [...counts].map(([canonicalId, quantity]) => ({ canonicalId, quantity, source }));
}

function unusedEquipmentInventory(
  pool: FabPregameCardPool,
  selection: FabPregameSelection,
): string[] {
  const used = new Map<string, number>();
  for (const canonicalId of Object.values(selection.equipment)) {
    if (!canonicalId) continue;
    used.set(canonicalId, (used.get(canonicalId) ?? 0) + 1);
  }
  const inventory: string[] = [];
  for (const entry of pool.entries) {
    if (entry.source !== "equipment") continue;
    const remaining = entry.quantity - (used.get(entry.canonicalId) ?? 0);
    for (let index = 0; index < remaining; index += 1) inventory.push(entry.canonicalId);
  }
  return inventory;
}

function materializeCatalogSeat(
  pool: FabPregameCardPool,
  selection: FabPregameSelection,
  seed: string,
  deckId: string,
  heroLife: number,
): FabPlayerFixture {
  const deckIds = selection.deck.flatMap((entry) =>
    Array.from({ length: entry.quantity }, () => entry.canonicalId),
  );
  const shuffled = shuffleWith(deckIds, seedFromString(`${seed}:deck:${deckId}`)).array;
  const inventory = unusedEquipmentInventory(pool, selection);
  const zone = (slot: keyof FabPregameSelection["equipment"]): string[] | undefined => {
    const canonicalId = selection.equipment[slot];
    return canonicalId ? [canonicalId] : undefined;
  };
  return {
    heroCardId: pool.heroId,
    life: heroLife,
    hand: shuffled.slice(0, OPENING_HAND_SIZE),
    deck: shuffled.slice(OPENING_HAND_SIZE),
    head: zone("head"),
    chest: zone("chest"),
    arms: zone("arms"),
    legs: zone("legs"),
    weapon1: zone("weapon1"),
    weapon2: zone("weapon2"),
    inventory: inventory.length > 0 ? inventory : undefined,
  };
}

export function resolveFabDeckTextFixture(
  library: FabDeckCardLibrary,
  deck: FabDeckTextFixture,
  seed: string,
): ResolvedFabDeckSeat {
  const cardDefinitions: Record<string, FabCardDefinitionInput> = {};
  const unresolved: string[] = [];
  let heroId: string | undefined;
  let heroLife = 20;
  const equipmentIds: string[] = [];
  const mainDeckIds: string[] = [];

  const heroCard = resolveCatalogCardByName(library, deck.hero);
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
    const card = resolveCatalogCardByName(library, parsed.name, parsed.pitch);
    if (!card) {
      unresolved.push(parsed.pitch ? `${parsed.name} (${parsed.pitch})` : parsed.name);
      continue;
    }
    registerFabCatalogDefinition(card, cardDefinitions);
    for (let i = 0; i < parsed.count; i++) equipmentIds.push(card.canonicalId);
  }

  for (const line of deck.mainDeck.split("\n")) {
    const parsed = parseFabDeckTextLine(line);
    if (!parsed) continue;
    const card = resolveCatalogCardByName(library, parsed.name, parsed.pitch);
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

  const cardPool: FabPregameCardPool = {
    format: deck.format === "classic-constructed" ? "cc" : "silverAge",
    heroId,
    entries: [
      ...countPoolEntries(equipmentIds, "equipment"),
      ...countPoolEntries(mainDeckIds, "main"),
    ],
    cardDefinitions,
  };
  const selection = createDefaultFabPregameSelection(cardPool);

  return {
    deckId: deck.id,
    label: deck.name,
    format: deck.format,
    unresolved,
    cardDefinitions,
    player: materializeCatalogSeat(cardPool, selection, seed, deck.id, heroLife),
  };
}

export function resolveFabDeckSelection(
  library: FabDeckCardLibrary,
  deckId: string,
  seed: string,
): ResolvedFabDeckSeat {
  const text = getFabDeckTextFixture(deckId);
  if (!text) throw new Error(`Unknown deck id: ${deckId}`);
  return resolveFabDeckTextFixture(library, text, seed);
}

export function resolveSafeFabDeckSelection(
  library: FabDeckCardLibrary,
  deckId: string | null | undefined,
  seed: string,
  fallbackId: string = DEFAULT_PLAYER_DECK_ID,
): ResolvedFabDeckSeat {
  if (deckId === null || deckId === undefined || deckId === "") {
    return resolveFabDeckSelection(library, fallbackId, seed);
  }
  return resolveFabDeckSelection(library, deckId, seed);
}

export { DEFAULT_BOT_DECK_ID, DEFAULT_PLAYER_DECK_ID };
