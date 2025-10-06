// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gopherShipsCarpenter: LorcanaCharacterCardDefinition = {
  id: "jxg",
  name: "Gopher",
  title: "Ship's Carpenter",
  characteristics: ["storyborn", "ally", "pirate"],
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 2,
  illustrator: "Wouter Bruneel",
  number: 4,
  set: "006",
  rarity: "uncommon",
};
