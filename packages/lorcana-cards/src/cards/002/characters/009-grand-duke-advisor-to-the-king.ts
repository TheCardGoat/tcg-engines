import type { CharacterCard } from "@tcg/lorcana-types";

export const grandDukeAdvisorToTheKing: CharacterCard = {
  id: "126",
  cardType: "character",
  name: "Grand Duke",
  version: "Advisor to the King",
  fullName: "Grand Duke - Advisor to the King",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "002",
  text: "YES, YOUR MAJESTY Your Prince, Princess, King, and Queen characters get +1 {S}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 9,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "89bc563db548c9dd14225a733168ff2128347893",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const grandDukeAdvisorToTheKing: LorcanitoCharacterCard = {
//   id: "uiz",
//   name: "Grand Duke",
//   title: "Advisor to the King",
//   characteristics: ["storyborn", "ally"],
//   text: "**YES, YOUR MAJESTY** Your Prince, Princess, King and Queen characters gain +1 {S}.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Yes, Your Majesty",
//       text: "Your Prince, Princess, King and Queen characters gain +1 {S}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "add",
//           amount: 1,
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "characteristics",
//                 value: ["prince", "princess", "king", "queen"],
//                 conjunction: "or",
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "He takes being opinionated to a higher level.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Javi Salas",
//   number: 9,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 522735,
//   },
//   rarity: "rare",
// };
//
