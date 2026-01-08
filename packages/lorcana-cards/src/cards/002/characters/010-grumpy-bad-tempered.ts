import type { CharacterCard } from "@tcg/lorcana-types";

export const grumpyBadtempered: CharacterCard = {
  id: "11e",
  cardType: "character",
  name: "Grumpy",
  version: "Bad-Tempered",
  fullName: "Grumpy - Bad-Tempered",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "THERE'S TROUBLE A-BREWIN' Your other Seven Dwarfs characters get +1 {S}.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 10,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "86c738780547edd83463f5cab7ae01ef47d47e64",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const grumpyBadTempered: LorcanitoCharacterCard = {
//   id: "wsw",
//   name: "Grumpy",
//   title: "Bad-Tempered",
//   characteristics: ["storyborn", "ally", "seven dwarfs"],
//   text: "**THERE'S TROUBLE A-BREWIN'** Your other Seven Dwarfs characters get +1 {S}.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "There's Trouble A-Brewin",
//       text: "Your other Seven Dwarfs characters get +1 {S}.",
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
//             excludeSelf: true,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["seven dwarfs"] },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Sour as a green gooseberry!",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 10,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526388,
//   },
//   rarity: "common",
// };
//
