// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { self, targetCard } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const tinkerBellInsistentFairy: LorcanitoCharacterCard = {
//   Id: "pi7",
//   Name: "Tinker Bell",
//   Title: "Insistent Fairy",
//   Characteristics: ["storyborn", "ally", "fairy"],
//   Text: "Evasive (Only characters with Evasive can challenge this character.)\nPAY ATTENTION Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
//   Type: "character",
//   Abilities: [
//     WheneverPlays({
//       Name: "PAY ATTENTION",
//       Text: "Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             Filter: "attribute",
//             Value: "strength",
//             Comparison: { operator: "gte", value: 5 },
//           },
//         ],
//       },
//       Optional: true,
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "source", value: "trigger" },
//               { filter: "status", value: "ready" },
//             ],
//           },
//           AfterEffect: [
//             {
//               Type: "create-layer-based-on-target",
//               Target: targetCard,
//               Filters: targetCard.filters,
//               Effects: [
//                 {
//                   Type: "lore",
//                   Modifier: "add",
//                   Amount: 2,
//                   Target: self,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//     EvasiveAbility,
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 1,
//   Illustrator: "Amber Kommanvongsa",
//   Number: 136,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631842,
//   },
//   Rarity: "legendary",
//   Lore: 1,
// };
//
