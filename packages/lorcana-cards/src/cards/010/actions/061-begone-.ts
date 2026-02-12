// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// Const chosenCharacterItemOrLocationWithCost3OrLess: CardEffectTarget = {
//   Type: "card",
//   Value: 1,
//   Filters: [
//     { filter: "type", value: ["character", "item", "location"] },
//     { filter: "zone", value: "play" },
//     {
//       Filter: "attribute",
//       Value: "cost",
//       Comparison: { operator: "lte", value: 3 },
//     },
//   ],
// };
//
// Export const begone: LorcanitoActionCard = {
//   Id: "r2b",
//   Name: "Begone!",
//   Characteristics: ["action"],
//   Text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
//   Type: "action",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Illustrator: "Agathe Molin",
//   Number: 61,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659420,
//   },
//   Rarity: "common",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Begone!",
//       Text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: chosenCharacterItemOrLocationWithCost3OrLess,
//         },
//       ],
//     },
//   ],
// };
//
