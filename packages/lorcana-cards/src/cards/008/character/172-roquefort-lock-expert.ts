// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const roquefortLockExpert: LorcanitoCharacterCard = {
//   Id: "of1",
//   Name: "Roquefort",
//   Title: "Lock Expert",
//   Characteristics: ["storyborn", "ally"],
//   Text: "SAFEKEEPING Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     WheneverThisCharacterQuests({
//       Name: "SAFEKEEPING",
//       Text: "Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "inkwell",
//           Exerted: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "Anderson Mahanski",
//   Number: 172,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631675,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
