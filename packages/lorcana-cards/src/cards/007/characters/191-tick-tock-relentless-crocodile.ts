import type { CharacterCard } from "@tcg/lorcana-types";

export const ticktockRelentlessCrocodile: CharacterCard = {
  id: "1qn",
  cardType: "character",
  name: "Tick-Tock",
  version: "Relentless Crocodile",
  fullName: "Tick-Tock - Relentless Crocodile",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "007",
  text: "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)",
  cost: 5,
  strength: 5,
  willpower: 6,
  lore: 1,
  cardNumber: 191,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e1cc4fc2b8f3553070493043ebc236022311ddc9",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   duringYourTurnThisCharacterGains,
//   evasiveAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ticktockRelentlessCrocodile: LorcanitoCharacterCard = {
//   id: "ipe",
//   name: "Tick-tock",
//   title: "Relentless Crocodile",
//   characteristics: ["storyborn"],
//   text: "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play.",
//   type: "character",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   strength: 5,
//   willpower: 6,
//   illustrator: "Rachel Elise",
//   number: 191,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619517,
//   },
//   rarity: "common",
//   lore: 1,
//   abilities: [
//     duringYourTurnThisCharacterGains({
//       name: "Looking for Lunch",
//       text: "During your turn, this character gains Evasive while a Pirate character is in play.",
//       ability: evasiveAbility,
//       conditions: [
//         {
//           type: "filter",
//           comparison: { operator: "gte", value: 1 },
//           filters: [
//             {
//               filter: "characteristics",
//               value: ["pirate"],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
// };
//
