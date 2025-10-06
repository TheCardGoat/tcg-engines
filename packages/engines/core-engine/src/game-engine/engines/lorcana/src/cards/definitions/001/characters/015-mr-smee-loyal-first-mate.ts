import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrSmee: LorcanitoCharacterCardDefinition = {
  id: "avd",
  name: "Mr. Smee",
  title: "Loyal First Mate",
  characteristics: ["dreamborn", "pirate", "ally"],
  type: "character",
  inkwell: true,
  illustrator: "Kamil Murzyn / Eri Welli",
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  number: 15,
  set: "TFC",
  rarity: "common",
};
