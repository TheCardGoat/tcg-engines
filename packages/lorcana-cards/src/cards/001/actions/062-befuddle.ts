import type { ActionCard } from "@tcg/lorcana-types";

export const befuddle: ActionCard = {
  abilities: [],
  cardNumber: 62,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Befuddle - undefined",
  id: "teb",
  inkType: ["amethyst"],
  inkable: true,
  name: "Befuddle",
  set: "001",
  text: "Return a character or item with cost 2 or less to their player",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const befuddle: LorcanitoActionCard = {
//   Id: "teb",
//   Name: "Befuddle",
//   Characteristics: ["action"],
//   Text: "Return a character or item with cost 2 or less to their player's hand.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Befuddle",
//       Text: "Return a character or item with cost 2 or less to their player's hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: ["character", "item"] },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "Never be afraid to have your mind boggled now and then.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 1,
//   Illustrator: "Kendall Hale",
//   Number: 62,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 503355,
//   },
//   Rarity: "uncommon",
// };
//
