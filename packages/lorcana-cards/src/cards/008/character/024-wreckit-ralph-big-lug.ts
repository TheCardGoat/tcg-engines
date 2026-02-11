// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   LorcanitoCharacterCard,
//   ResolutionAbility,
// } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   Self,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Const backOnTrackAbility: ResolutionAbility = {
//   Type: "resolution",
//   Name: "BACK ON TRACK",
//   Text: "When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
//   Optional: true,
//   Effects: [
//     {
//       Type: "move",
//       To: "hand",
//       Exerted: false,
//       ShouldRevealMoved: true,
//       Conditions: [],
//       Target: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "zone", value: "discard" },
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["racer"] },
//           {
//             Filter: "attribute",
//             Value: "cost",
//             Comparison: { operator: "lte", value: 6 },
//           },
//         ],
//       },
//       AfterEffect: [
//         {
//           Type: "create-layer-based-on-target",
//           // required but not used
//           Target: thisCharacter,
//           Effects: [
//             {
//               Type: "lore",
//               Modifier: "add",
//               Amount: 1,
//               Target: self,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
//
// Export const wreckitRalphBigLug: LorcanitoCharacterCard = {
//   Id: "wwd",
//   Name: "Wreck-it Ralph",
//   Title: "Big Lug",
//   Characteristics: ["floodborn", "hero", "racer"],
//   Text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Wreck-It Ralph.)\nBACK ON TRACK When you play this character and whenever he quests, you may return a Racer character card with cost 6 or less from your discard to your hand. If you do, gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(5, "Wreck-It Ralph"),
//     WhenYouPlayThisCharacter({ ...backOnTrackAbility }),
//     WheneverThisCharacterQuests({ ...backOnTrackAbility }),
//   ],
//   Inkwell: false,
//   Colors: ["amber", "ruby"],
//   Cost: 7,
//   Strength: 7,
//   Willpower: 5,
//   Illustrator: "Javi Salas",
//   Number: 24,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631682,
//   },
//   Rarity: "super_rare",
//   Lore: 1,
// };
//
