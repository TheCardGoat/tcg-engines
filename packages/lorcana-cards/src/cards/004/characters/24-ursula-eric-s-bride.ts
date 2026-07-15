// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const ursulaEricsBride: LorcanitoCharacterCard = {
//   Id: "hvg",
//   MissingTestCase: true,
//   Name: "Ursula",
//   Title: "Eric's Bride",
//   Characteristics: ["floodborn", "sorcerer", "villain", "princess"],
//   Text: "**Shift: Discard a song card** _(You may discard a song card to play this on top of one of your characters named Ursula.)_\n\n**VANESSA'S DESIGN** Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(
//       [
//         {
//           Type: "card",
//           Action: "discard",
//           Amount: 1,
//           Filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "action" },
//             { filter: "characteristics", value: ["song"] },
//           ],
//         },
//       ],
//       "ursula",
//       "**Shift: Discard a song card**",
//     ),
//     WheneverQuests({
//       Name: "VANESSA'S DESIGN",
//       Text: "Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: ["location", "item", "action"] },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//         OpponentRevealHand,
//       ],
//     }),
//   ],
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Lisanne Koeteeuw",
//   Number: 24,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547763,
//   },
//   Rarity: "rare",
// };
//
