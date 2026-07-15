// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   AnyCard,
//   NamedCard,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const brunoMadrigalUndetectedUncle: LorcanitoCharacterCard = {
//   Id: "le7",
//   Reprints: ["tiq"],
//   Name: "Bruno Madrigal",
//   Title: "Undetected Uncle",
//   Characteristics: ["storyborn", "ally", "madrigal"],
//   Text: "**Evasive**\n**YOU JUST HAVE TO SEE IT** {E} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     {
//       Type: "activated",
//       Name: "You Just Have To See It",
//       Text: "Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.",
//       NameACard: true,
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "reveal-top-card",
//           Target: namedCard,
//           OnTargetMatchEffects: [
//             {
//               Type: "move",
//               To: "hand",
//               Target: anyCard,
//             },
//             YouGainLore(3),
//           ],
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Juan Diego Leon",
//   Number: 39,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550566,
//   },
//   Rarity: "super_rare",
// };
//
