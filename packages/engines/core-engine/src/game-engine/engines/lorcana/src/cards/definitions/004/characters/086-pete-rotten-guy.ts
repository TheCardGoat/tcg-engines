import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peteRottenGuy: LorcanitoCharacterCardDefinition = {
  id: "hdo",
  name: "Pete",
  title: "Rotten Guy",
  characteristics: ["storyborn", "villain", "musketeer"],
  type: "character",
  flavour:
    "Minnie: This is an outrage! \nPete: No. It's my nefarious plan to steal the throne.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  illustrator: "Stefano Zanchi",
  number: 86,
  set: "URR",
  rarity: "uncommon",
};
