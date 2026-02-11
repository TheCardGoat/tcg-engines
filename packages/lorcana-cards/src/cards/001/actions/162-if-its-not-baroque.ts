import type { ActionCard } from "@tcg/lorcana-types";

export const ifItsNotBaroque: ActionCard = {
  abilities: [
    {
      effect: {
        type: "return-from-discard",
        cardType: "item",
        target: "CONTROLLER",
      },
      id: "v94-1",
      text: "Return an item card from your discard to your hand.",
      type: "action",
    },
  ],
  cardNumber: 162,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "70a3ce5be1d7585ab65ae97f23db433fa975768b",
  },
  franchise: "Beauty and the Beast",
  id: "v94",
  inkType: ["sapphire"],
  inkable: false,
  name: "If it’s Not Baroque",
  set: "001",
  text: "Return an item card from your discard to your hand.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const ifItsNotBaroque: LorcanitoActionCard = {
//   Id: "m65",
//   Name: "If It's Not Baroque",
//   Characteristics: ["action"],
//   Text: "Return an item card from your discard to your hand.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: ". . . Don't fix it.",
//   Colors: ["sapphire"],
//   Cost: 3,
//   Illustrator: "Kenneth Anderson",
//   Number: 162,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 505980,
//   },
//   Rarity: "rare",
// };
//
