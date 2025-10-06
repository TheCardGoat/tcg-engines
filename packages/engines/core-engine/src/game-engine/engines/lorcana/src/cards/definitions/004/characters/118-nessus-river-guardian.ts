import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nessusRiverGuardian: LorcanitoCharacterCardDefinition = {
  id: "qof",
  name: "Nessus",
  title: "River Guardian",
  characteristics: ["storyborn", "villain"],
  type: "character",
  flavour:
    "He sent the eels away when they came with the sea witch's offer. He didn't need her help making trouble.",
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 7,
  willpower: 5,
  illustrator: "Justin Runfola",
  number: 118,
  set: "URR",
  rarity: "uncommon",
  lore: 2,
};
