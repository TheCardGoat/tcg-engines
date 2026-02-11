// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { putAllCardsFromDiscardToInkwellFaceDownAndExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const perditaDeterminedMother: LorcanitoCharacterCard = {
//   Id: "iue",
//   Name: "Perdita",
//   Title: "Determined Mother",
//   Characteristics: ["floodborn", "hero"],
//   Text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Perdita.)\nQUICK, EVERYONE HIDE When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(4, "Perdita"),
//     WhenYouPlayThisCharacter({
//       Name: "QUICK, EVERYONE HIDE",
//       Text: "When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [
//         PutAllCardsFromDiscardToInkwellFaceDownAndExerted({
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "owner", value: "self" },
//             { filter: "characteristics", value: ["puppy"] },
//           ],
//         }),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amber", "sapphire"],
//   Cost: 6,
//   Strength: 4,
//   Willpower: 6,
//   Illustrator: "Brian Weiss",
//   Number: 27,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 630061,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
