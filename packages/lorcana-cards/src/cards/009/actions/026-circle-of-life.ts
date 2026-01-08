import type { ActionCard } from "@tcg/lorcana-types";

export const circleOfLife: ActionCard = {
  id: "1bo",
  cardType: "action",
  name: "Circle of Life",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "009",
  text: "Sing Together 8 Play a character from your discard for free.",
  actionSubtype: "song",
  cost: 8,
  cardNumber: 26,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aa0a28cbf35abf2cf2485c2a6780cf51d732a51e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const circleOfLife: LorcanitoActionCard = {
//   id: "w6g",
//   missingTestCase: false,
//   name: "Circle Of Life",
//   characteristics: ["action", "song"],
//   text: "Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)\nPlay a character from your discard for free.",
//   type: "action",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 8,
//   illustrator: "Eri Welli",
//   number: 26,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649225,
//   },
//   rarity: "legendary",
//   abilities: [
//     singerTogetherAbility(8),
//     {
//       type: "resolution",
//       name: "**CIRCLE OF LIFE**",
//       text: "Play a character from your discard for free.",
//       effects: [
//         {
//           type: "play",
//           forFree: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
