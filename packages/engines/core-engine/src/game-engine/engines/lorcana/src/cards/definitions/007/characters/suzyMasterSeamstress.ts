import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const suzyMasterSeamstress: LorcanaCharacterCardDefinition = {
  id: "mwq",
  name: "Suzy",
  title: "Master Seamstress",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Kopik",
  number: 8,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
