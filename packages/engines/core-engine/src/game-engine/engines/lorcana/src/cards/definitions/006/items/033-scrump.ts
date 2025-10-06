import { iMadeHer } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scrump: LorcanaItemCardDefinition = {
  id: "jwu",
  missingTestCase: true,
  name: "Scrump",
  characteristics: [],
  text: "I MADE HER {E} one of your characters - Chosen character gets -2 {S} until the start of your next turn.",
  type: "item",
  abilities: [iMadeHer],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Kipik",
  number: 33,
  set: "006",
  rarity: "uncommon",
};
