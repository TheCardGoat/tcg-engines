import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioTalkativePuppet: CharacterCard = {
  id: "njx",
  cardType: "character",
  name: "Pinocchio",
  version: "Talkative Puppet",
  fullName: "Pinocchio - Talkative Puppet",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "TELLING LIES When you play this character, you may exert chosen opposing character.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 58,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "54e34e5ca1450807ff2d91e78c5462ae095adfd5",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const pinocchioTalkativePuppet: LorcanitoCharacterCard = {
//   id: "gkt",
//
//   name: "Pinocchio",
//   title: "Talkative Puppet",
//   characteristics: ["hero", "storyborn"],
//   text: "**TELLING LIES** When you play this character, you may exert chosen opposing character.",
//   type: "character",
//   abilities: [
//     {
//       optional: true,
//       type: "resolution",
//       name: "Telling Lies",
//       text: "When you play this character, you may exert chosen opposing character.",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "A lie keeps growing and growing until it's as plain as the nose on your face. \n−Blue Fairy",
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Juan Diego Leon",
//   number: 58,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525086,
//   },
//   rarity: "uncommon",
// };
//
