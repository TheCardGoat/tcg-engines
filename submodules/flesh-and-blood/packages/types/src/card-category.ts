import type { FabSubtype, FabType, FabTypeBox } from "./base-object-properties.ts";
import type { FabKeyword } from "./abilities/keyword.ts";

/** CR 1.3.2 card categories used by deck construction and start-of-game setup. */
export type FabCardCategory = "hero" | "token" | "deck" | "arena" | "unsupported";

const FAB_DECK_CARD_TYPES: ReadonlySet<FabType> = new Set([
  "Action",
  "Attack Reaction",
  "Block",
  "Defense Reaction",
  "Instant",
  "Mentor",
  "Resource",
]);

const FAB_NON_CARD_OR_UNSUPPORTED_TYPES: ReadonlySet<FabType> = new Set([
  "Event",
  "Macro",
  "Placeholder Card",
]);

const FAB_EQUIPPABLE_SUBTYPES: ReadonlySet<FabSubtype> = new Set([
  "1H",
  "2H",
  "Arms",
  "Chest",
  "Head",
  "Legs",
  "Off-Hand",
  "Quiver",
]);

/**
 * Classify a card from its structured type box.
 *
 * CR 1.3.2c defines deck-cards positively by type. CR 1.3.2d defines an
 * arena-card as a non-hero, non-token, non-deck-card. Macro objects and the
 * catalog's pure Event/Placeholder records are not legal card-pool entries,
 * so callers receive an explicit unsupported result for them.
 */
export function getFabCardCategory(typeBox: Pick<FabTypeBox, "types">): FabCardCategory {
  if (typeBox.types.length === 0) return "unsupported";
  if (typeBox.types.includes("Hero")) return "hero";
  if (typeBox.types.includes("Token")) return "token";
  if (typeBox.types.some((type) => FAB_DECK_CARD_TYPES.has(type))) return "deck";
  if (typeBox.types.every((type) => FAB_NON_CARD_OR_UNSUPPORTED_TYPES.has(type))) {
    return "unsupported";
  }
  return "arena";
}

export function isFabDeckCard(typeBox: Pick<FabTypeBox, "types">): boolean {
  return getFabCardCategory(typeBox) === "deck";
}

export function isFabArenaCard(typeBox: Pick<FabTypeBox, "types">): boolean {
  return getFabCardCategory(typeBox) === "arena";
}

/** Deck-cards and arena-cards are the only cards that belong in a card-pool. */
export function isFabCardPoolCard(typeBox: Pick<FabTypeBox, "types">): boolean {
  const category = getFabCardCategory(typeBox);
  return category === "deck" || category === "arena";
}

/**
 * Whether an arena-card can be selected into an equipment or weapon zone by
 * the ordinary start-of-game procedure (CR 4.1.4a and 3.16.2a), including
 * Modular equipment that gains its zone subtype only once equipped (CR 8.3.30).
 */
export function isFabEquippableArenaCard(
  typeBox: Pick<FabTypeBox, "types" | "subtypes">,
  keywords: readonly Pick<FabKeyword, "name">[] = [],
): boolean {
  return (
    isFabArenaCard(typeBox) &&
    (typeBox.types.includes("Weapon") ||
      typeBox.subtypes.some((subtype) => FAB_EQUIPPABLE_SUBTYPES.has(subtype)) ||
      keywords.some((keyword) => keyword.name === "modular"))
  );
}
