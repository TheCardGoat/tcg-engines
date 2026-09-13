import {
  basePropertiesOf,
  registerFabCardDefinition,
  type FabCardDefinitionInput,
} from "./cards.ts";
import { isFabArenaCard, isFabDeckCard } from "@tcg/flesh-and-blood-types";
import type { FabSupertype } from "@tcg/flesh-and-blood-types";
import { createFabValidationCard } from "./deck-validation-card.ts";
import {
  FAB_FORMAT_RULES,
  fabWeaponAreaEntry,
  resolveFabWeaponLayout,
  fabEquipmentSlots,
  validateFabDeckConstruction,
  type FabValidationCode,
  type FabEquipmentSlot,
  type FabPregameFormat,
} from "./deck-validation.ts";
export {
  FAB_FORMAT_RULES,
  type FabEquipmentSlot,
  type FabPregameFormat,
  type FabHeroAge,
  type FabFormatRules,
} from "./deck-validation.ts";

export type FabCardPoolSource = "equipment" | "main" | "inventory";

export interface FabCardPoolEntry {
  readonly canonicalId: string;
  readonly quantity: number;
  readonly source: FabCardPoolSource;
}

export interface FabPregameCardPool {
  readonly format: FabPregameFormat;
  readonly heroId: string;
  readonly entries: readonly FabCardPoolEntry[];
  readonly cardDefinitions: Readonly<Record<string, FabCardDefinitionInput>>;
}

export interface FabDeckSelectionEntry {
  readonly canonicalId: string;
  readonly quantity: number;
}

export interface FabPregameSelection {
  readonly equipment: Readonly<Partial<Record<FabEquipmentSlot, string>>>;
  readonly deck: readonly FabDeckSelectionEntry[];
}

export interface FabPregameIssue {
  readonly code:
    | FabValidationCode
    | "unknown-card"
    | "invalid-quantity"
    | "quantity-exceeded"
    | "arena-card-in-deck"
    | "wrong-equipment-slot"
    | "weapon-combination"
    | "equip-restricted"
    | "hero-supertype-mismatch"
    | "specialization-mismatch"
    | "deck-too-small"
    | "deck-size"
    | "hero-in-card-pool"
    | "mentor-requires-young-hero"
    | "companion-not-arena-card"
    | "macro-outside-macro-object";
  readonly message: string;
  readonly canonicalId?: string;
  readonly slot?: FabEquipmentSlot;
}

export interface FabPregameValidation {
  readonly valid: boolean;
  readonly deckCount: number;
  readonly requiredDeckCount: number;
  readonly issues: readonly FabPregameIssue[];
}

function hasType(definition: FabCardDefinitionInput | undefined, type: string): boolean {
  if (!definition) return false;
  const typeBox = basePropertiesOf(registerFabCardDefinition(definition)).typeBox;
  const expected = type.toLowerCase();
  return [...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes].some(
    (value) => value.toLowerCase() === expected,
  );
}

export function isFabArenaCardDefinition(definition: FabCardDefinitionInput | undefined): boolean {
  if (!definition) return false;
  return isFabArenaCard(basePropertiesOf(registerFabCardDefinition(definition)).typeBox);
}

export function fabEquipmentSlotForDefinition(
  definition: FabCardDefinitionInput | undefined,
): Exclude<FabEquipmentSlot, "weapon1" | "weapon2"> | "weapon" | null {
  if (hasType(definition, "Head")) return "head";
  if (hasType(definition, "Chest")) return "chest";
  if (hasType(definition, "Arms")) return "arms";
  if (hasType(definition, "Legs")) return "legs";
  if (
    hasType(definition, "Weapon") ||
    hasType(definition, "Off-Hand") ||
    hasType(definition, "Quiver")
  )
    return "weapon";
  return null;
}

export function fabRequiredDeckCount(format: FabPregameFormat): number {
  return FAB_FORMAT_RULES[format].deckSize;
}

export interface FabHeroDeckbuildingAccess {
  /** Supertypes printed in the hero's type box (CR 2.11). */
  readonly printedSupertypes: readonly FabSupertype[];
  /** Additional supertypes granted only for deckbuilding by Essence (CR 8.3.16). */
  readonly essenceSupertypes: readonly FabSupertype[];
  /** The effective entitlement used for CR 1.1.3 card-pool legality. */
  readonly effectiveSupertypes: readonly FabSupertype[];
}

/**
 * Resolve a hero's card-pool entitlement without changing its printed identity.
 * Elemental is a talent of its own; Earth, Ice, and Lightning enter this set only
 * when printed on the hero or explicitly granted by Essence.
 */
export function fabHeroDeckbuildingAccess(
  heroDefinition: FabCardDefinitionInput | undefined,
): FabHeroDeckbuildingAccess {
  if (!heroDefinition) {
    return { printedSupertypes: [], essenceSupertypes: [], effectiveSupertypes: [] };
  }
  const properties = basePropertiesOf(registerFabCardDefinition(heroDefinition));
  const printedSupertypes = properties.typeBox.supertypes.filter(
    (type): type is FabSupertype => true,
  );
  const essenceSupertypes = properties.keywords.flatMap((keyword) =>
    keyword.name === "essence" ? keyword.supertypes : [],
  );
  const uniqueEssenceSupertypes = [...new Set(essenceSupertypes)];
  return {
    printedSupertypes,
    essenceSupertypes: uniqueEssenceSupertypes,
    effectiveSupertypes: [...new Set([...printedSupertypes, ...uniqueEssenceSupertypes])],
  };
}

export function fabEquipmentSlotsForDefinition(
  definition: FabCardDefinitionInput | undefined,
): readonly FabEquipmentSlot[] {
  return definition ? fabEquipmentSlots(createFabValidationCard(definition)) : [];
}

export function validateFabPregameSelection(
  pool: FabPregameCardPool,
  selection: FabPregameSelection,
  options: { readonly relaxDeckSize?: boolean } = {},
): FabPregameValidation {
  const ids = new Set([
    pool.heroId,
    ...pool.entries.map((entry) => entry.canonicalId),
    ...selection.deck.map((entry) => entry.canonicalId),
    ...Object.values(selection.equipment).filter((id): id is string => Boolean(id)),
  ]);
  const cards = Object.fromEntries(
    [...ids].flatMap((id) => {
      const definition = pool.cardDefinitions[id];
      return definition ? [[id, createFabValidationCard(definition)]] : [];
    }),
  );
  const result = validateFabDeckConstruction({
    mode: "selection",
    format: pool.format,
    heroId: pool.heroId,
    entries: pool.entries,
    cards,
    selection,
    relaxDeckSize: options.relaxDeckSize,
  });
  const issues: FabPregameIssue[] = result.issues.map((issue) => ({
    ...issue,
    code:
      issue.code === "card_pool"
        ? "hero-supertype-mismatch"
        : issue.code === "specialization"
          ? "specialization-mismatch"
          : issue.code === "cc_minimum"
            ? "deck-too-small"
            : issue.code === "blitz_size"
              ? "deck-size"
              : issue.code === "arena-card-in-deck" &&
                  issue.canonicalId &&
                  hasType(pool.cardDefinitions[issue.canonicalId], "Macro")
                ? "macro-outside-macro-object"
                : issue.code,
  }));
  return {
    valid: issues.length === 0,
    issues,
    deckCount: selection.deck.reduce(
      (sum, entry) =>
        sum + (Number.isInteger(entry.quantity) && entry.quantity > 0 ? entry.quantity : 0),
      0,
    ),
    requiredDeckCount: FAB_FORMAT_RULES[pool.format].deckSize,
  };
}

/** Validate equipment and canonicalize its effective weapon layout together. */
export function resolveFabEquipmentSelection(
  pool: FabPregameCardPool,
  equipment: FabPregameSelection["equipment"],
):
  | { readonly status: "accepted"; readonly equipment: FabPregameSelection["equipment"] }
  | { readonly status: "rejected"; readonly issues: readonly FabPregameIssue[] } {
  const validation = validateFabPregameSelection(
    pool,
    { equipment, deck: [] },
    { relaxDeckSize: true },
  );
  const issues = validation.issues.filter((issue) =>
    [
      "wrong-equipment-slot",
      "weapon-combination",
      "equip-restricted",
      "pairs",
      "quantity-exceeded",
      "unknown-card",
    ].includes(issue.code),
  );
  if (issues.length) return { status: "rejected", issues };
  const heroDefinition = pool.cardDefinitions[pool.heroId];
  const hero = heroDefinition ? createFabValidationCard(heroDefinition) : undefined;
  const entry = (id: string | undefined) => {
    if (!id) return undefined;
    const definition = pool.cardDefinitions[id];
    return definition
      ? { ...fabWeaponAreaEntry(createFabValidationCard(definition), hero), id }
      : undefined;
  };
  const result = resolveFabWeaponLayout({
    weapon1: entry(equipment.weapon1),
    weapon2: entry(equipment.weapon2),
  });
  if (result.status === "rejected") {
    return {
      status: "rejected",
      issues: result.issues.map((message) => ({ code: "weapon-combination", message })),
    };
  }
  const { weapon1: _weapon1, weapon2: _weapon2, ...body } = equipment;
  return {
    status: "accepted",
    equipment: {
      ...body,
      ...(result.layout.weapon1 ? { weapon1: result.layout.weapon1.id } : {}),
      ...(result.layout.weapon2 ? { weapon2: result.layout.weapon2.id } : {}),
    },
  };
}

/** Equipment affordances consult the same resolver as locking/materializing. */
export function isFabEquipmentSelectionLegal(
  pool: FabPregameCardPool,
  equipment: FabPregameSelection["equipment"],
): boolean {
  return resolveFabEquipmentSelection(pool, equipment).status === "accepted";
}

/** Replace one slot, preserving legal companions and normalizing both selection orders. */
export function proposeFabEquipmentSelection(
  pool: FabPregameCardPool,
  equipment: FabPregameSelection["equipment"],
  slot: FabEquipmentSlot,
  id: string,
): FabPregameSelection["equipment"] | null {
  const proposal = { ...equipment, [slot]: id };
  const resolved = resolveFabEquipmentSelection(pool, proposal);
  if (resolved.status === "accepted") return resolved.equipment;
  if (slot === "weapon1" && proposal.weapon2) {
    delete proposal.weapon2;
    const replacement = resolveFabEquipmentSelection(pool, proposal);
    if (replacement.status === "accepted") return replacement.equipment;
  }
  return null;
}

function addDeckCount(target: Map<string, number>, canonicalId: string, quantity: number): void {
  if (quantity <= 0) return;
  target.set(canonicalId, (target.get(canonicalId) ?? 0) + quantity);
}

function autoSeatEquipment(pool: FabPregameCardPool): FabPregameSelection["equipment"] {
  let equipment: Partial<Record<FabEquipmentSlot, string>> = {};
  // A second pass allows a Pairs card whose partner was encountered later.
  for (let pass = 0; pass < 2; pass += 1) {
    for (const entry of pool.entries.flatMap((entry) =>
      Array.from({ length: Math.min(entry.quantity, 6) }, () => entry),
    )) {
      const id = entry.canonicalId;
      const available = pool.entries
        .filter((candidate) => candidate.canonicalId === id)
        .reduce((sum, candidate) => sum + candidate.quantity, 0);
      if (Object.values(equipment).filter((selected) => selected === id).length >= available)
        continue;
      const definition = pool.cardDefinitions[id];
      for (const slot of fabEquipmentSlotsForDefinition(definition)) {
        if (equipment[slot]) continue;
        const proposal = { ...equipment, [slot]: id };
        const resolved = resolveFabEquipmentSelection(pool, proposal);
        if (resolved.status === "rejected") continue;
        equipment = resolved.equipment;
        break;
      }
    }
  }
  return equipment;
}

export function createDefaultFabPregameSelection(pool: FabPregameCardPool): FabPregameSelection {
  const deck = new Map<string, number>();
  const rules = FAB_FORMAT_RULES[pool.format];
  let remaining = rules.exactDeckSize ? rules.deckSize : Infinity;
  // Select every deck-card, including inventory. Exact-size formats retain
  // registered main-deck priority and leave only the excess in inventory.
  for (const source of ["main", "inventory", "equipment"] as const) {
    for (const entry of pool.entries) {
      if (entry.source !== source || remaining <= 0) continue;
      const definition = pool.cardDefinitions[entry.canonicalId];
      if (
        !definition ||
        !isFabDeckCard(basePropertiesOf(registerFabCardDefinition(definition)).typeBox)
      )
        continue;
      const quantity = Math.min(entry.quantity, remaining);
      addDeckCount(deck, entry.canonicalId, quantity);
      remaining -= quantity;
    }
  }
  return {
    equipment: autoSeatEquipment(pool),
    deck: [...deck].map(([canonicalId, quantity]) => ({ canonicalId, quantity })),
  };
}

export function reconcileFabPregameSelection(
  pool: FabPregameCardPool,
  selection: FabPregameSelection,
): { readonly selection: FabPregameSelection; readonly validation: FabPregameValidation } {
  // Never replace a player's valid, confirmed loadout. An invalid or incomplete
  // selection uses the same deterministic default as initial preparation.
  const validation = validateFabPregameSelection(pool, selection);
  if (validation.valid) {
    const resolved = resolveFabEquipmentSelection(pool, selection.equipment);
    if (resolved.status === "accepted")
      return { selection: { ...selection, equipment: resolved.equipment }, validation };
  }
  const fallback = createDefaultFabPregameSelection(pool);
  return { selection: fallback, validation: validateFabPregameSelection(pool, fallback) };
}
