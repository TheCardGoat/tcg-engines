import type { ActionCard } from "@tcg/lorcana-types";

export const standOut: ActionCard = {
  id: "1gf",
  cardType: "action",
  name: "Stand Out",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 94,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bed4e9a5870bd978e803e8b8939fe601e61b1b04",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
//
// export const standOut: LorcanitoActionCard = {
//   id: "s55",
//   missingTestCase: true,
//   name: "Stand Out",
//   characteristics: ["action", "song"],
//   text: "(A character with cost 3 or more can {E} to sing this song for free.)\nChosen character gets +3 {S} and gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
//   type: "action",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Raquel Villanueva",
//   number: 94,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647675,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 3,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//           duration: "next_turn",
//           until: true,
//         },
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
// };
//
