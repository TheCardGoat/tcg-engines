import type { ItemCard } from "@tcg/lorcana-types";

export const weightSet: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        type: "optional",
      },
      id: "1vv-1",
      name: "TRAINING",
      text: "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 204,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "f4a817b51d3a5cca4d03b98d0eddc55294471120",
  },
  franchise: "Hercules",
  id: "1vv",
  inkType: ["steel"],
  inkable: true,
  name: "Weight Set",
  set: "002",
  text: "TRAINING Whenever you play a character with 4 or more, you may pay 1 to draw a card.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const weightSet: LorcanitoItemCard = {
//   Id: "k1c",
//
//   Name: "Weight Set",
//   Characteristics: ["item"],
//   Text: "**TRAINING** Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
//   Type: "item",
//   Abilities: [
//     WheneverTargetPlays({
//       Name: "Training",
//       Text: "Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
//       Optional: true,
//       Costs: [{ type: "ink", amount: 1 }],
//       TriggerFilter: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//         {
//           Filter: "attribute",
//           Value: "strength",
//           Comparison: { operator: "gte", value: 4 },
//         },
//       ],
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "Go the distance with the right equipment.",
//   Colors: ["steel"],
//   Cost: 3,
//   Inkwell: true,
//   Illustrator: "Brian Weisz",
//   Number: 204,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 527529,
//   },
//   Rarity: "rare",
// };
//
