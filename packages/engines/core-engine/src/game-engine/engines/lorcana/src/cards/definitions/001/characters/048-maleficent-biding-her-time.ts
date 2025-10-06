import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentBinding: LorcanaCharacterCardDefinition = {
  id: "d0r",
  name: "Maleficent",
  title: "Biding Her Time",
  characteristics: ["dreamborn", "sorcerer", "villain"],
  type: "character",
  flavour:
    '"One mustn\'t rush these things, or the greatest \rplan might come to nothing."',
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  illustrator: "Grace Tran",
  number: 48,
  set: "TFC",
  rarity: "rare",
};
