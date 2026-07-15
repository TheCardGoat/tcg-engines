// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const donaldGhostHunter: LorcanitoCharacterCard = {
//   Id: "yoy",
//   Name: "Donald Duck",
//   Title: "Ghost Hunter",
//   Characteristics: ["dreamborn", "hero", "detective"],
//   Text: "RAISE A RUCKUS When you play this character, choose a Detective character to gain Challenger +2 for the rest of this turn. (While challenging, that character gets +2 {S}.)",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 4,
//   Strength: 5,
//   Willpower: 4,
//   Illustrator: "Carmine Cassese",
//   Number: 172,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659396,
//   },
//   Rarity: "common",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "RAISE A RUCKUS",
//       Text: "When you play this character, choose a Detective character to gain Challenger +2 for the rest of this turn.",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "challenger",
//           Amount: 2,
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["detective"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Lore: 1,
// };
//
