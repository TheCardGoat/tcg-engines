import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sirKayUnrulyKnight: LorcanitoCharacterCardDefinition = {
  id: "bms",
  name: "Sir Kay",
  title: "Unruly Knight",
  characteristics: ["storyborn", "knight"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Kevin Schjutte",
  number: 144,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
