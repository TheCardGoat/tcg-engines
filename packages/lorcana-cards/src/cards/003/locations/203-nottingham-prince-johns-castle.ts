import type { LocationCard } from "@tcg/lorcana-types";

export const nottinghamPrinceJohnsCastle: LocationCard = {
  id: "kic",
  cardType: "location",
  name: "Nottingham",
  version: "Prince John's Castle",
  fullName: "Nottingham - Prince John's Castle",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 203,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "49eaf235e4c4e6023ea58dbe1ef6315db3948ef4",
  },
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
//
// export const nottinghamPrinceJohnsCastle: LorcanitoLocationCard = {
//   id: "jc5",
//   type: "location",
//   name: "Nottingham",
//   title: "Prince John's Castle",
//   characteristics: ["location"],
//   flavour:
//     "Sir Hiss: I say, ssssire, your mother's castle would be the perfect place to bring our plan to life! \nPrince John: Mummy!",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   willpower: 6,
//   lore: 1,
//   moveCost: 1,
//   illustrator: "Bryn Jones",
//   number: 203,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539118,
//   },
//   rarity: "common",
// };
//
