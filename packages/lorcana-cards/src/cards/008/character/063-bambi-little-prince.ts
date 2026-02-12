// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const bambiLittlePrince: LorcanitoCharacterCard = {
//   Id: "bxw",
//   Name: "Bambi",
//   Title: "Little Prince",
//   Characteristics: ["storyborn", "hero", "prince"],
//   Text: "SAY HELLO When you play this character, gain 1 lore.\nKIND OF BASHFUL When an opponent plays a character, return this character to your hand.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Effects: [youGainLore(1)],
//     }),
//     WheneverTargetPlays({
//       Name: "KIND OF BASHFUL",
//       Text: "When an opponent plays a character, return this character to your hand.",
//       // pending confirmation if all returning to hand should be from play to hand.
//       // This Card always mean from play, but changing this is too risky so I'm not doing now.
//       // effects: [returnThisCardToHand],
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           From: "play",
//           Target: thisCharacter,
//         },
//       ],
//       TriggerFilter: [
//         { filter: "owner", value: "opponent" },
//         { filter: "type", value: "character" },
//         { filter: "zone", value: "play" },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 1,
//   Illustrator: "Brian Weiss",
//   Number: 63,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631341,
//   },
//   Rarity: "rare",
//   Lore: 3,
// };
//
