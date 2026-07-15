// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const fourDozenEggs: LorcanitoActionCard = {
//   Id: "cww",
//   Reprints: ["wfa"],
//
//   Name: "Four Dozen Eggs",
//   Characteristics: ["action", "song"],
//   Text: "_(A character with cost 4 or more can {E} to sing this\nsong for free.)_\n\nYour characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Four Dozen Eggs",
//       Text: "Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "resist",
//           Amount: 2,
//           Modifier: "add",
//           Duration: "next_turn",
//           Until: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 4,
//   Illustrator: "Jochem Van Gool",
//   Number: 163,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 525091,
//   },
//   Rarity: "uncommon",
// };
//
