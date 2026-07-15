import type { ActionCard } from "@tcg/lorcana-types";

export const suddenChill: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "pz4-1",
      text: "Each opponent chooses and discards a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 98,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  id: "pz4",
  inkType: ["emerald"],
  inkable: true,
  name: "Sudden Chill",
  set: "001",
  text: "Each opponent chooses and discards a card.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const suddenChill: LorcanitoActionCard = {
//   Id: "pz4",
//   Reprints: ["f3l"],
//   Name: "Sudden Chill",
//   Characteristics: ["action", "song"],
//   Text: "Each opponent chooses and discards a card.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Sudden Chill",
//       Text: "Each opponent chooses and discards a card.",
//       Optional: false,
//       Responder: "opponent",
//       ResolveImmediately: true,
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "Cruella De Vil, Cruella De Vil \nIf she doesn't scare you, no evil thing will",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Illustrator: "Giulia Riva",
//   Number: 98,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508346,
//   },
//   Rarity: "common",
// };
//
