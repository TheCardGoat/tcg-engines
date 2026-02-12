import type { ActionCard } from "@tcg/lorcana-types";

export const controlYourTemper: ActionCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "nur-1",
      text: "Chosen character gets -2 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 26,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "55f9630150960925f548c841768e0cd6ac3aa1ef",
  },
  franchise: "Beauty and the Beast",
  id: "nur",
  inkType: ["amber"],
  inkable: true,
  name: "Control Your Temper!",
  set: "001",
  text: "Chosen character gets -2 {S} this turn.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const controlYourTemper: LorcanitoActionCard = {
//   Id: "eny",
//   Name: "Control Your Temper!",
//   Characteristics: ["action"],
//   Text: "Chosen character gets -2 {S} this turn.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "subtract",
//           Duration: "turn",
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
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 1,
//   Illustrator: "Amber Kommavongsa",
//   Number: 26,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493501,
//   },
//   Rarity: "common",
// };
//
