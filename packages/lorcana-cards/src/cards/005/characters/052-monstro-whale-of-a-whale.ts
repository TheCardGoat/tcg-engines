import type { CharacterCard } from "@tcg/lorcana-types";

export const monstroWhaleOfAWhale: CharacterCard = {
  id: "bmt",
  cardType: "character",
  name: "Monstro",
  version: "Whale of a Whale",
  fullName: "Monstro - Whale of a Whale",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "005",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  cardNumber: 52,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "29ee1170b2ca2e8b9dff1156c7e6bb4b0c5e68c0",
  },
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const monstroWhaleOfAWhale: LorcanitoCharacterCard = {
//   id: "rdj",
//   name: "Monstro",
//   title: "Whale of a Whale",
//   characteristics: ["storyborn"],
//   type: "character",
//   flavour:
//     "The great beast breached the surface of the Azurite Sea, and the cry went out, Monstro! Monstro!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 5,
//   willpower: 6,
//   lore: 1,
//   illustrator: "Ivan Shavrin",
//   number: 52,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559512,
//   },
//   rarity: "uncommon",
// };
//
