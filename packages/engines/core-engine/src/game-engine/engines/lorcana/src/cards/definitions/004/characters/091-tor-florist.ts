import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const torFlorist: LorcanitoCharacterCardDefinition = {
  id: "g1b",
  name: "Tor",
  title: "Florist",
  characteristics: ["dreamborn", "ally"],
  type: "character",
  flavour:
    "They say that his arrangements are exquisite, \nHis composites and bouquets are so divine. \nBut when the crowds try to come and visit, \nThere's always quite a fight to form a line.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 4,
  willpower: 7,
  lore: 1,
  illustrator: "Anderson Mahanski",
  number: 91,
  set: "URR",
  rarity: "common",
};
