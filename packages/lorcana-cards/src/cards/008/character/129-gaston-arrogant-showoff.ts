// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import {
//   GetStrengthThisTurn,
//   MayBanish,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const gastonArrogantShowoff: LorcanitoCharacterCard = {
//   Id: "jpd",
//   Name: "Gaston",
//   Title: "Arrogant Showoff",
//   Characteristics: ["storyborn", "villain"],
//   Text: "BREAK APART When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharacter({
//       Name: "BREAK APART",
//       Text: "When you play this character, you may banish one of your items to give chosen character +2 {S} this turn.",
//       Optional: true,
//       DependentEffects: true,
//       ResolveEffectsIndividually: true,
//       Effects: [
//         MayBanish({
//           Type: "card",
//           Value: 1,
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "item" },
//             { filter: "zone", value: "play" },
//           ],
//         }),
//         GetStrengthThisTurn(2, chosenCharacter),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 4,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Saimolostorec",
//   Number: 129,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 632687,
//   },
//   Rarity: "common",
//   Lore: 1,
// };
//
