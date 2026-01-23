import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentBidingHerTime: CharacterCard = {
  id: "134",
  cardType: "character",
  name: "Maleficent",
  version: "Biding Her Time",
  fullName: "Maleficent - Biding Her Time",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "001",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 48,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "8e5d2579bbefbbf47af0d10c5c66ccaf2c3e4a95",
  },
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const maleficentBinding: LorcanitoCharacterCard = {
//   id: "d0r",
//   name: "Maleficent",
//   title: "Biding Her Time",
//   characteristics: ["dreamborn", "sorcerer", "villain"],
//   type: "character",
//   flavour:
//     '"One mustn\'t rush these things, or the greatest \rplan might come to nothing."',
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 1,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Grace Tran",
//   number: 48,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493485,
//   },
//   rarity: "rare",
// };
//
