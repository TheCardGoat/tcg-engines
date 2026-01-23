import type { CharacterCard } from "@tcg/lorcana-types";

export const merryweatherGoodFairy: CharacterCard = {
  id: "u0v",
  cardType: "character",
  name: "Merryweather",
  version: "Good Fairy",
  fullName: "Merryweather - Good Fairy",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "005",
  text: "RAY OF HOPE When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 76,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6c35723c292aac252c2a8a33118cbc89f23b554c",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const merryweatherGoodFairy: LorcanitoCharacterCard = {
//   id: "xjs",
//   name: "Merryweather",
//   title: "Good Fairy",
//   characteristics: ["storyborn", "ally", "fairy"],
//   text: "**RAY OF HOPE** When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "RAY OF HOPE",
//       text: "When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
//       costs: [{ type: "ink", amount: 1 }],
//       optional: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "The most beautiful color is blue!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Eri Weli",
//   number: 76,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559737,
//   },
//   rarity: "common",
// };
//
