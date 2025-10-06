import type { LorcanaCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

/**
 * Creates placeholder card entries for missing card numbers in set 009
 * @param existingNumbers Array of existing card numbers
 * @param maxNumber Maximum card number to fill up to
 * @returns Array of placeholder cards
 */
export function createPlaceholderCards(
  existingNumbers: number[],
  maxNumber: number,
): LorcanaCardDefinition[] {
  const placeholderCards: LorcanaCardDefinition[] = [];

  // Create a set of existing numbers for quick lookup
  const existingNumbersSet = new Set(existingNumbers);

  // Loop through all possible card numbers and create placeholders for missing ones
  for (let i = 1; i <= maxNumber; i++) {
    if (!existingNumbersSet.has(i)) {
      placeholderCards.push({
        id: `009-${i.toString().padStart(3, "0")}`,
        name: `Placeholder ${i}`,
        number: i,
        cost: 0,
        strength: 0,
        willpower: 0,
        lore: 0,
        type: "character",
        title: `Placeholder Card ${i}`,
        set: "009",
        illustrator: "",
        colors: ["amber"],
        characteristics: [],
        notImplemented: true,
        rarity: "common",
      });
    }
  }

  return placeholderCards;
}
