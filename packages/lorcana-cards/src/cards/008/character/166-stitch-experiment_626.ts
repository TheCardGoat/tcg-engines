// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// Import {
//   ThisCard,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { putTopCardOfOpponentDeckIntoTheirInkwell } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const stitchExperiment_626: LorcanitoCharacterCard = {
//   Id: "fjv",
//   Name: "Stitch",
//   Title: "Experiment 626",
//   Characteristics: ["storyborn", "hero", "alien"],
//   Text: "SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell.\nSTEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play him for free and he enters play exerted.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "SO NAUGHTY",
//       Text: "When you play this character, each opponent puts the top card of their deck into their inkwell.",
//       Effects: [putTopCardOfOpponentDeckIntoTheirInkwell],
//     }),
//     AtTheStartOfYourTurn({
//       Name: "STEALTH MODE",
//       Text: "At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play him for free and he enters play exerted.",
//       Optional: true,
//       DoesItTriggerFromDiscard: true,
//       DependentEffects: true,
//       Conditions: [
//         {
//           Type: "filter",
//           Filters: [...thisCard.filters, { filter: "zone", value: "discard" }],
//           Comparison: { operator: "eq", value: 1 },
//         },
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "hand" },
//             { filter: "attribute", value: "inkwell", comparison: true },
//           ],
//           Comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 1,
//           AfterEffect: [
//             {
//               Type: "create-layer-based-on-target",
//               Target: thisCharacter,
//               Effects: [
//                 {
//                   Type: "play",
//                   ForFree: true,
//                   Exerted: true,
//                   Target: thisCard,
//                 },
//               ],
//             },
//           ],
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//               { filter: "attribute", value: "inkwell", comparison: true },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Matteo Marzocco",
//   Number: 166,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631463,
//   },
//   Rarity: "legendary",
//   Lore: 2,
// };
//
