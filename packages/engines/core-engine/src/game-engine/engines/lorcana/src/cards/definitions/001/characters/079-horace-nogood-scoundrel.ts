import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const horaceNoGood: LorcanitoCharacterCardDefinition = {
  id: "jyy",
  name: "Horace",
  title: "No-Good Scoundrel",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "Well, they ain't in here, Jasper.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Isaiah Mesq",
  number: 79,
  set: "TFC",
  rarity: "common",
};
