import type { CharacterCard } from "@tcg/lorcana-types";

export const antonioMadrigalAnimalExpert: CharacterCard = {
  id: "1tt",
  cardType: "character",
  name: "Antonio Madrigal",
  version: "Animal Expert",
  fullName: "Antonio Madrigal - Animal Expert",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 35,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "ed2c6a48f6ed632a88bdc391071033dde8e10b17",
  },
  classifications: ["Storyborn", "Ally", "Madrigal"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const antonioMadrigalAnimalExpert: LorcanitoCharacterCard = {
//   id: "zij",
//   name: "Antonio Madrigal",
//   title: "Animal Expert",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   type: "character",
//   flavour:
//     "Once upon a time, there was a casita in the mountains with a very special family. . . .",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Ellie Horie",
//   number: 35,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550521,
//   },
//   rarity: "uncommon",
// };
//
