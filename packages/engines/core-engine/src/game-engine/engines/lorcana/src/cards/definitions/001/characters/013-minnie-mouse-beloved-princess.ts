import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseBelovedPrincess: LorcanaCharacterCardDefinition = {
  id: "ycw",

  name: "Minnie Mouse",
  title: "Beloved Princess",
  characteristics: ["dreamborn", "princess"],
  type: "character",
  flavour:
    "Wherever the princess goes, her musketeers are. . . well, they're around somewhere, probably.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 13,
  set: "TFC",
  rarity: "common",
};
