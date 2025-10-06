import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const honestJohnShamelessSchemer: LorcanaCharacterCardDefinition = {
  id: "hq3",
  name: "Honest John",
  title: "Shameless Schemer",
  characteristics: ["storyborn", "villain"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 7,
  willpower: 5,
  illustrator: "Valentina Graziuso",
  number: 122,
  set: "008",
  rarity: "uncommon",
  lore: 2,
};
