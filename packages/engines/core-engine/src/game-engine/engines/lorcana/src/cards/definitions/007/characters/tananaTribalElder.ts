import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tananaTribalElder: LorcanaCharacterCardDefinition = {
  id: "sui",
  name: "Tanana",
  title: "Tribal Elder",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 4,
  willpower: 4,
  illustrator: "Fujita Kazuyoshi",
  number: 46,
  set: "007",
  rarity: "common",
  lore: 1,
};
