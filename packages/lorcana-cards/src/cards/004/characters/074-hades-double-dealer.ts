import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesDoubleDealer: CharacterCard = {
  id: "i41",
  cardType: "character",
  name: "Hades",
  version: "Double Dealer",
  fullName: "Hades - Double Dealer",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "HERE'S THE TRADE-OFF {E}, Banish one of your other characters — Play a character with the same name as the banished character for free.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 74,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "41475c2d6dbdfd43222184e0da43f5c1a3f810ab",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const hadesDoubleDealer: LorcanitoCharacterCard = {
//   id: "pib",
//   missingTestCase: true,
//   name: "Hades",
//   title: "Double Dealer",
//   characteristics: ["storyborn", "villain", "deity"],
//   text: "**GET DOWN TO BUSINESS** {E},  Banish chosen character of yours - Play another character from your hand with the same name.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "**GET DOWN TO BUSINESS** ",
//       text: "{E},  Banish chosen character of yours - Play another character from your hand with the same name.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               target: thisCharacter,
//               effects: [
//                 {
//                   type: "play",
//                   forFree: true,
//                   target: {
//                     type: "card",
//                     value: 1,
//                     filters: [
//                       { filter: "owner", value: "self" },
//                       { filter: "zone", value: "hand" },
//                       {
//                         filter: "attribute",
//                         value: "name",
//                         compareWithParentsTarget: true,
//                         comparison: { operator: "eq", value: "target" },
//                       },
//                     ],
//                   },
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Alan Batson",
//   number: 74,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550575,
//   },
//   rarity: "legendary",
// };
//
