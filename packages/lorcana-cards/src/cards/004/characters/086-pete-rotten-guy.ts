import type { CharacterCard } from "@tcg/lorcana-types";

export const peteRottenGuy: CharacterCard = {
  id: "12m",
  cardType: "character",
  name: "Pete",
  version: "Rotten Guy",
  fullName: "Pete - Rotten Guy",
  inkType: ["emerald"],
  set: "004",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 86,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "8b2e154aa83c63bb57795fcfc6fafc0507afe3f7",
  },
  classifications: ["Storyborn", "Villain", "Musketeer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const peteRottenGuy: LorcanitoCharacterCard = {
//   id: "hdo",
//   name: "Pete",
//   title: "Rotten Guy",
//   characteristics: ["storyborn", "villain", "musketeer"],
//   type: "character",
//   flavour:
//     "Minnie: This is an outrage! \nPete: No. It's my nefarious plan to steal the throne.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 1,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Stefano Zanchi",
//   number: 86,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549516,
//   },
//   rarity: "uncommon",
// };
//
