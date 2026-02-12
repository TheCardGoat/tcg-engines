// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const liloCausingAnUproar: LorcanitoCharacterCard = {
//   Id: "x31",
//   Name: "Lilo",
//   Title: "Causing an Uproar",
//   Characteristics: ["dreamborn", "hero"],
//   Text: "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.\nRAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Conditions: [
//         { type: "during-turn", value: "self" },
//         { type: "played-actions", comparison: { operator: "gte", value: 3 } },
//       ],
//       Name: "STOMPIN' TIME!",
//       Ability: "effects",
//       Text: "During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
//       Effects: [
//         {
//           Type: "replacement",
//           Replacement: "cost",
//           Duration: "static",
//           Amount: 5,
//           Target: thisCharacter,
//         },
//       ],
//     },
//     WhenYouPlayThis({
//       Name: "RAAAWR!",
//       Text: "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
//       Optional: false,
//       Effects: [
//         ...readyAndCantQuest({
//           Type: "card",
//           Value: 1,
//           Filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//           ],
//         }),
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Julien Vandois",
//   Number: 137,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631439,
//   },
//   Rarity: "legendary",
//   Lore: 2,
// };
//
