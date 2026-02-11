// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { returnFromDiscardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const kingCandySugarRushNightmare: LorcanitoCharacterCard = {
//   Id: "sg3",
//   Name: "King Candy",
//   Title: "Sugar Rush Nightmare",
//   Characteristics: ["storyborn", "villain", "king", "racer"],
//   Text: "A NEW ROSTER When this character is banished, you may return another Racer character card from your discard to your hand.",
//   Type: "character",
//   Abilities: [
//     WhenThisCharacterBanished({
//       Name: "A NEW ROSTER",
//       Text: "When this character is banished, you may return another Racer character card from your discard to your hand.",
//       Optional: true,
//       Effects: [
//         ReturnFromDiscardToHand({
//           ExcludeSelf: true,
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             { filter: "characteristics", value: ["racer"] },
//           ],
//         }),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber", "ruby"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 2,
//   Illustrator: "Joseph Buening",
//   Number: 23,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631367,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
