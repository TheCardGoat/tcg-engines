// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Const chosenCharacter: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "zone", value: "play" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// Export const strengthOfARagingFire: LorcanitoActionCard = {
//   Id: "x5y",
//   Reprints: ["fua"],
//   Name: "Strength of a Raging Fire",
//   Characteristics: ["action", "song"],
//   Text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nDeal damage to chosen character equal to the number of characters you have in play.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Strength of a Raging Fire",
//       Text: "Deal damage to chosen character equal to the number of characters you have in play.",
//       Effects: [
//         {
//           Type: "damage",
//           Target: chosenCharacter,
//           Amount: {
//             Dynamic: true,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "Tranquil as a forest \nBut on fire within",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 3,
//   Illustrator: "Jared Nickerl / Alex Accorsi",
//   Number: 201,
//   Set: "ROF",
//   ExternalIds: {
//     TcgPlayer: 527238,
//   },
//   Rarity: "rare",
// };
//
