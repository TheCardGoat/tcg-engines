import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSmeeLoyalFirstMate: CharacterCard = {
  id: "ufb",
  cardType: "character",
  name: "Mr. Smee",
  version: "Loyal First Mate",
  fullName: "Mr. Smee - Loyal First Mate",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "001",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 15,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "6da7dcf840af520dd86dd608720bcfcb84825627",
  },
  classifications: ["Dreamborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mrSmee: LorcanitoCharacterCard = {
//   id: "avd",
//   name: "Mr. Smee",
//   title: "Loyal First Mate",
//   characteristics: ["dreamborn", "pirate", "ally"],
//   type: "character",
//   inkwell: true,
//   illustrator: "Kamil Murzyn / Eri Welli",
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   number: 15,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508697,
//   },
//   rarity: "common",
// };
//
