import type { CharacterCard } from "@tcg/lorcana-types";

export const pachaVillageLeader: CharacterCard = {
  id: "1g5",
  cardType: "character",
  name: "Pacha",
  version: "Village Leader",
  fullName: "Pacha - Village Leader",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "002",
  cost: 6,
  strength: 4,
  willpower: 8,
  lore: 2,
  cardNumber: 190,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "bbf6ecb7ad7e750253021a6c00fe4f304d10cf24",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const pachaVillageLeader: LorcanitoCharacterCard = {
//   id: "lxx",
//
//   name: "Pacha",
//   title: "Village Leader",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour: "Don't be fooled by the folksy peasant look. \n−Kuzco",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 4,
//   willpower: 8,
//   lore: 2,
//   illustrator: "Koni",
//   number: 190,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527778,
//   },
//   rarity: "uncommon",
// };
//
