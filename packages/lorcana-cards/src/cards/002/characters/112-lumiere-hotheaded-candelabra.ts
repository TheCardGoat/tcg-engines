import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereHotheadedCandelabra: CharacterCard = {
  id: "17o",
  cardType: "character",
  name: "Lumiere",
  version: "Hotheaded Candelabra",
  fullName: "Lumiere - Hotheaded Candelabra",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "002",
  cost: 7,
  strength: 7,
  willpower: 7,
  lore: 2,
  cardNumber: 112,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "9d7305004401aa554595195f27a27b11729ec5a0",
  },
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const lumiereHotheadedCandelabra: LorcanitoCharacterCard = {
//   id: "r40",
//
//   name: "Lumiere",
//   title: "Hotheaded Candelabra",
//   characteristics: ["dreamborn", "ally"],
//   type: "character",
//   flavour: "When things heat up, no one can hold a candle to him.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 7,
//   strength: 7,
//   willpower: 7,
//   lore: 2,
//   illustrator: "Giulia Riva",
//   number: 112,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525111,
//   },
//   rarity: "rare",
// };
//
