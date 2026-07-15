// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const medallionWeights: LorcanitoItemCard = {
//   Id: "xo1",
//   Reprints: ["c57"],
//   Name: "Medallion Weights",
//   Characteristics: ["item"],
//   Text: "**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Discipline And Strength",
//       Costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       Text: "{E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "add",
//           Duration: "turn",
//           Target: chosenCharacter,
//         },
//         {
//           Type: "ability",
//           Ability: "custom",
//           Modifier: "add",
//           Duration: "turn",
//           Target: chosenCharacter,
//           CustomAbility: wheneverChallengesAnotherChar({
//             Name: "Discipline And Strength",
//             Text: "Whenever they challenge another character this turn, you may draw a card.",
//             Optional: true,
//             Effects: [drawACard],
//           }),
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Illustrator: "Defne Tōzūm",
//   Number: 132,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 549430,
//   },
//   Rarity: "uncommon",
// };
//
