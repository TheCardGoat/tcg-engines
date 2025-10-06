import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theMouseQueenRulerOfMousedom: LorcanaCharacterCardDefinition = {
  id: "wmf",
  name: "The Mouse Queen",
  title: "Ruler of Mousedom",
  characteristics: ["storyborn", "ally", "queen"],
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 6,
  illustrator: "Jon Dansk / Hayley Evans",
  number: 153,
  set: "008",
  rarity: "common",
  lore: 1,
};
