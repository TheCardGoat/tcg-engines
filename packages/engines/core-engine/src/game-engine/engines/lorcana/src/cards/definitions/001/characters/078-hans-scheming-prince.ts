import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hansSchemingPrince: LorcanitoCharacterCardDefinition = {
  id: "s45",
  name: "Hans",
  title: "Scheming Prince",
  characteristics: ["storyborn", "villain", "prince"],
  type: "character",
  flavour: "Rules are like older siblings. All they do is get in the way.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 3,
  illustrator: "Massimiliano Narciso",
  number: 78,
  set: "TFC",
  rarity: "rare",
};
