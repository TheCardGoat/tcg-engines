import type { ActionCard } from "@tcg/lorcana-types";

export const smashundefined: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "ub4-1",
      text: "Deal 3 damage to chosen character.",
      type: "action",
    },
  ],
  cardNumber: 200,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Smash - undefined",
  id: "ub4",
  inkType: ["steel"],
  inkable: true,
  name: "Smash",
  set: "001",
  text: "Deal 3 damage to chosen character.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const smash: LorcanitoActionCard = {
//   Id: "ub4",
//   Reprints: ["zfz"],
//   Name: "Smash",
//   Characteristics: ["action"],
//   Text: "Deal 3 damage to chosen character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Smash",
//       Text: "Deal 3 damage to chosen character.",
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 3,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: '"Go away!"',
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Illustrator: "Simangaliso Sibaya",
//   Number: 200,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508943,
//   },
//   Rarity: "uncommon",
// };
//
