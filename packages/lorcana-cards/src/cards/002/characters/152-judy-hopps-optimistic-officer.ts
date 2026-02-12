// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenItem } from "@lorcanito/lorcana-engine/abilities/target";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { BanishEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const judyHoppsOptimisticOfficer: LorcanitoCharacterCard = {
//   Id: "xdx",
//   Reprints: ["bcu"],
//   Name: "Judy Hopps",
//   Title: "Optimistic Officer",
//   Characteristics: ["hero", "storyborn"],
//   Text: "**DON'T CALL ME CUTE** When you play this character, you may banish chosen item. Its player draws a card.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Don't Call me Cute",
//       Text: "When you play this character, you may banish chosen item. Its player draws a card.",
//       Optional: true,
//       DependentEffects: true,
//       Effects: [
//         {
//           Type: "banish",
//           Target: chosenItem,
//         } as BanishEffect,
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: { type: "player", value: "target_owner" },
//         },
//       ],
//     },
//   ],
//   Flavour:
//     "I'll get to the bottom of what happened with that locked lorebook. You can count on me!",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Arianna Rea",
//   Number: 152,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 526398,
//   },
//   Rarity: "uncommon",
// };
//
