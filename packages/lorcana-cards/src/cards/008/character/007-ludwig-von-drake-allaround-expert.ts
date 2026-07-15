// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   WhenThisIsBanished,
//   WhenYouPlayThis,
// } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import {
//   OpponentDiscardsACard,
//   OpponentRevealHand,
//   PutThisCardIntoYourInkwellExerted,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const ludwigVonDrakeAllaroundExpert: LorcanitoCharacterCard = {
//   Id: "juw",
//   Name: "Ludwig Von Drake",
//   Title: "All-Around Expert",
//   Characteristics: ["storyborn", "ally"],
//   Text: "SUPERIOR MIND When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.\nLASTING LEGACY When this character is banished, you may put this card into your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "SUPERIOR MIND",
//       Text: "When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         OpponentRevealHand,
//         OpponentDiscardsACard([
//           { filter: "type", value: ["location", "item", "action"] },
//         ]),
//       ],
//     }),
//     WhenThisIsBanished({
//       Name: "LASTING LEGACY",
//       Text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [putThisCardIntoYourInkwellExerted],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amber", "sapphire"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 1,
//   Illustrator: "Pietro B. Zemelo",
//   Number: 7,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631353,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
