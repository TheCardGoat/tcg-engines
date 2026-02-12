import type { ActionCard } from "@tcg/lorcana-types";

export const aWholeNewWorld: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 7,
        target: "EACH_PLAYER",
        type: "draw",
      },
      id: "u8m-1",
      text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 195,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  id: "u8m",
  inkType: ["steel"],
  inkable: true,
  name: "A Whole New World",
  set: "001",
  text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const aWholeNewWorld: LorcanitoActionCard = {
//   Id: "u8m",
//   Name: "A Whole New World",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "A Whole New World",
//       Text: "Each player discards their hand and draws 7 cards.",
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 60,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "zone", value: "hand" }],
//           },
//         },
//         {
//           Type: "draw",
//           Amount: 7,
//           Target: {
//             Type: "player",
//             Value: "all",
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "Shining, shimmering, splendid . . .",
//   Colors: ["steel"],
//   Cost: 5,
//   Illustrator: "Koni",
//   Number: 195,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506088,
//   },
//   Rarity: "super_rare",
// };
//
