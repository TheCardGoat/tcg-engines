import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const khanWarHorse: LorcanaCharacterCardDefinition = {
  id: "au3",
  name: "Khan",
  title: "War Horse",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 7,
  illustrator: "Delfin Tejuja",
  number: 193,
  set: "008",
  rarity: "rare",
  lore: 1,
};
