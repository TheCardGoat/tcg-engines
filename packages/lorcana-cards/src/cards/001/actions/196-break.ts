import type { ActionCard } from "@tcg/lorcana-types";

export const breakCard: ActionCard = {
  abilities: [
    {
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
      id: "m37-1",
      text: "Banish chosen item.",
      type: "action",
    },
  ],
  cardNumber: 196,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "4f9cac8dbc4c67a388b8379dcc126c90c7c5e72a",
  },
  franchise: "Beauty and the Beast",
  id: "m37",
  inkType: ["steel"],
  inkable: true,
  name: "Break",
  set: "001",
  text: "Banish chosen item.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const breakAction: LorcanitoActionCard = {
//   Id: "whn",
//   Name: "Break",
//   Characteristics: ["action"],
//   Text: "Banish chosen item.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: ["item"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "No one throws a tantrum like a beast.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Illustrator: "Grace Tran",
//   Number: 196,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506000,
//   },
//   Rarity: "common",
// };
//
