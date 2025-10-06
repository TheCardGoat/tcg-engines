import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
export const goonsMaleficent: LorcanaCharacterCardDefinition = {
  id: "blh",
  name: "Goons",
  title: "Maleficent's Underlings",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "They may seem useless, but they came with the castle.",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Cam Kendell",
  number: 179,
  set: "TFC",
  rarity: "common",
};
