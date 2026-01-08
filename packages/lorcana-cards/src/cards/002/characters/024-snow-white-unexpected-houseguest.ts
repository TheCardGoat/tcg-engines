import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteUnexpectedHouseguest: CharacterCard = {
  id: "1sk",
  cardType: "character",
  name: "Snow White",
  version: "Unexpected Houseguest",
  fullName: "Snow White - Unexpected Houseguest",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "HOW DO YOU DO? You pay 1 {I} less to play Seven Dwarfs characters.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 24,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e8b4c6153e06c369d41c32903f772a650246e12c",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const snowWhiteUnexpectedHouseGuest: LorcanitoCharacterCard = {
//   id: "pyl",
//   name: "Snow White",
//   title: "Unexpected Houseguest",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**HOW DO YOU DO?** You pay 1 {I} less to play Seven Dwarfs characters.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "How Do You Do?",
//       text: "You pay 1 {I} less to play Seven Dwarfs characters.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "static",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["seven dwarfs"] },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Nothing says 'hello' better than a fresh-baked pie.",
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Samanta Erdini",
//   number: 24,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526378,
//   },
//   rarity: "uncommon",
// };
//
