import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioStarAttraction: CharacterCard = {
  id: "1mk",
  cardType: "character",
  name: "Pinocchio",
  version: "Star Attraction",
  fullName: "Pinocchio - Star Attraction",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 3,
  cardNumber: 56,
  inkable: false,
  vanilla: true,
  externalIds: {
    ravensburger: "d1cd767d29cabb0cb3fe0dd1487a3ebdf527f903",
  },
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const pinocchioStarAttraction: LorcanitoCharacterCard = {
//   id: "z8x",
//
//   name: "Pinocchio",
//   title: "Star Attraction",
//   characteristics: ["hero", "storyborn"],
//   type: "character",
//   flavour:
//     "With that personality, that profile, that physique . . . \nWhy, I can see your name in lights, lights six feet high. \n−Honest John",
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   lore: 3,
//   illustrator: "Kapik",
//   number: 56,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525080,
//   },
//   rarity: "rare",
// };
//
