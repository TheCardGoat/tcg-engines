import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const balooFunLovingBear: LorcanaCharacterCardDefinition = {
  id: "vpf",

  name: "Baloo",
  title: "Fun-Loving Bear",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour: "The bees are buzzin in the tree to make some honey just for me!",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "R. la Barbera / L. Giammichele",
  number: 103,
  set: "ROF",
  rarity: "common",
};
