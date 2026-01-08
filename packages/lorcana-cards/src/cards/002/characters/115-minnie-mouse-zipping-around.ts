import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseZippingAround: CharacterCard = {
  id: "10o",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Zipping Around",
  fullName: "Minnie Mouse - Zipping Around",
  inkType: ["ruby"],
  set: "002",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "8433f91cfb8ba15b376066e72658edc6d2b85843",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const minnieMouseZippingAround: LorcanitoCharacterCard = {
//   id: "d3n",
//
//   name: "Minnie Mouse",
//   title: "Zipping Around",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour: "Zero to fun in under three seconds!",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 2,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Ellie Horie",
//   number: 115,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 524290,
//   },
//   rarity: "common",
// };
//
