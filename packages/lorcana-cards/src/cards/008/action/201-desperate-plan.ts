// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   HaveCardsInYourHand,
//   HaveNoCardsInYourHand,
// } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
// Import type { CreateLayerBasedOnCondition } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Const conditionalEffects: CreateLayerBasedOnCondition = {
//   Type: "create-layer-based-on-condition",
//   // TODO: Target not needed
//   Target: self,
//   ConditionalEffects: [
//     {
//       Conditions: [haveCardsInYourHand],
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 1, // THIS IS A PLACEHOLDER, the actual value lives in the target
//           Target: {
//             Type: "card",
//             Value: 99,
//             UpTo: true,
//             Filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           ForEach: [drawACard],
//         },
//       ],
//     },
//     {
//       Conditions: [haveNoCardsInYourHand],
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 3,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     },
//   ],
// };
//
// Export const desperatePlan: LorcanitoActionCard = {
//   Id: "y5k",
//   Name: "Desperate Plan",
//   Characteristics: ["action"],
//   Text: "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
//   Type: "action",
//   Inkwell: false,
//   Colors: ["steel"],
//   Cost: 3,
//   Illustrator: "Gianluca Barone",
//   Number: 201,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631482,
//   },
//   Rarity: "rare",
//   Abilities: [
//     {
//       Type: "resolution",
//       Effects: [conditionalEffects],
//     },
//   ],
// };
//
