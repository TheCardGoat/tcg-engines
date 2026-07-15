// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   WhenChallenged,
//   WhenYouPlayThis,
// } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const scroogeMcduckShushAgent: LorcanitoCharacterCard = {
//   Id: "j53",
//   Name: "Scrooge McDuck",
//   Title: "S.H.U.S.H. Agent",
//   Characteristics: ["storyborn", "hero"],
//   Text: "BACKUP PLAN When you play this character, draw a card, then choose and discard a card. ON THE MOVE When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
//   Type: "character",
//   Inkwell: false,
//   Colors: ["emerald"],
//   Cost: 2,
//   Strength: 0,
//   Willpower: 2,
//   Illustrator: "Federico Maria Cugliari",
//   Number: 89,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659464,
//   },
//   Rarity: "super_rare",
//   Lore: 2,
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "BACKUP PLAN",
//       Text: "When you play this character, draw a card, then choose and discard a card.",
//       ResolveEffectsIndividually: true,
//       DependentEffects: false,
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//         {
//           Type: "discard",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               {
//                 Filter: "zone",
//                 Value: "hand",
//               },
//               {
//                 Filter: "owner",
//                 Value: "self",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//     WhenChallenged({
//       Name: "ON THE MOVE",
//       Text: "When this character is challenged, return this card to your hand. (No damage is dealt in that challenge.)",
//       Effects: [returnThisCardToHand],
//     }),
//   ],
// };
//
