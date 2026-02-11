// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const madDogKarnagesFirstMate: LorcanitoCharacterCard = {
//   Id: "a0y",
//   Name: "Mad Dog",
//   Title: "Karnage's First Mate",
//   Characteristics: ["storyborn", "ally", "pirate"],
//   Text: "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisForEachYouPayLess({
//       Name: "ARE YOU SURE THIS IS SAFE, CAPTAIN?",
//       Text: "If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
//       Amount: {
//         Dynamic: true,
//         FilterMultiplier: 1,
//         Filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           {
//             Filter: "attribute",
//             Value: "name",
//             Comparison: {
//               Operator: "eq",
//               Value: "Don Karnage",
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 4,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Luis Huerta",
//   Number: 93,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631680,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
