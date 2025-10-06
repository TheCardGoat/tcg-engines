import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tianaDiligentWaitress: LorcanaCharacterCardDefinition = {
  id: "e3u",
  reprints: ["ljv"],
  name: "Tiana",
  title: "Diligent Waitress",
  characteristics: ["hero", "storyborn", "princess"],
  type: "character",
  flavour:
    '"My place is going to be special, with great food to fill people\'s bellies an hot jazz to feed their souls!"',
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Samanta Erdini",
  number: 197,
  set: "ROF",
  rarity: "common",
};
