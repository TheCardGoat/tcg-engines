// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const bernardOverprepared: LorcanitoCharacterCard = {
//   Id: "d5e",
//   Name: "Bernard",
//   Title: "Over-Prepared",
//   Characteristics: ["storyborn", "hero"],
//   Text: "GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "GO DOWN THERE AND INVESTIGATE",
//       Text: "When you play this character, if you have an Ally character in play, you may draw a card.",
//       Optional: true,
//       Conditions: [
//         {
//           Type: "filter",
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             {
//               Filter: "type",
//               Value: "character",
//             },
//             {
//               Filter: "characteristics",
//               Value: ["ally"],
//             },
//           ],
//           Comparison: { operator: "gte", value: 1 },
//         },
//       ],
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: self,
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["sapphire", "steel"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Illustrator: "McKay Anderson",
//   Number: 169,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631465,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
