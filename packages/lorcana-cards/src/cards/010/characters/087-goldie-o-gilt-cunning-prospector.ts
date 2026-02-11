// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { wheneverThisCharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import {
//   OpponentDiscardsACard,
//   OpponentRevealHand,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const goldieOgiltCunningProspector: LorcanitoCharacterCard = {
//   Id: "o5c",
//   Name: "Goldie O'gilt",
//   Title: "Cunning Prospector",
//   Characteristics: ["storyborn"],
//   Text: "CLAIM JUMPER When you play this character, chosen opponent reveals their hand and discards a location card of your choice.\nSTRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 4,
//   Illustrator: "Jiahui Eva Gao",
//   Number: 87,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 658880,
//   },
//   Rarity: "rare",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "CLAIM JUMPER",
//       Text: "When you play this character, chosen opponent reveals their hand and discards a location card of your choice.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         OpponentRevealHand,
//         OpponentDiscardsACard([{ filter: "type", value: "location" }]),
//       ],
//     }),
//     WheneverThisCharacterQuests({
//       Name: "STRIKE GOLD",
//       Text: "Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "deck",
//           Bottom: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "location" },
//               { filter: "zone", value: "discard" },
//             ],
//           },
//           ForEach: [
//             {
//               Type: "lore",
//               Amount: 1,
//               Modifier: "add",
//               Target: self,
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   Lore: 1,
// };
//
