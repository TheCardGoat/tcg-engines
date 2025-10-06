// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theWalrusGreedyGourmand: LorcanaCharacterCardDefinition = {
  id: "dh1",
  name: "The Walrus",
  title: "Greedy Gourmand",
  characteristics: ["storyborn"],
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  illustrator: "Carlos Luzzi",
  number: 46,
  set: "006",
  rarity: "uncommon",
};
