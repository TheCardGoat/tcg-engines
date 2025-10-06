import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kronRightHandMan: LorcanaCharacterCardDefinition = {
  id: "qie",
  name: "Kronk",
  title: "Right-Hand Man",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "Oh yeah. It's all coming together!",
  inkwell: true,
  colors: ["steel"],
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  illustrator: "Jake Parker",
  number: 183,
  set: "TFC",
  rarity: "uncommon",
};
