import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const flynnRiderConfidentVagabond: LorcanitoCharacterCardDefinition = {
  id: "nzv",

  name: "Flynn Rider",
  title: "Confident Vagabond",
  characteristics: ["hero", "storyborn", "prince"],
  type: "character",
  flavour:
    '"I love a good fan club, but they could at least <b>try</b> to get the nose right!"',
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Ron Baird",
  number: 81,
  set: "ROF",
  rarity: "common",
};
