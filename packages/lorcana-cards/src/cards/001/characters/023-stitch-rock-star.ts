// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const stitchRockStar: LorcanitoCharacterCard = {
//   Id: "q0n",
//   Reprints: ["yom"],
//   Name: "Stitch",
//   Title: "Rock Star",
//   Characteristics: ["hero", "floodborn", "alien"],
//   Text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Stitch._)/n**Adoring Fans** Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
//   Type: "character",
//   Abilities: [
//     WheneverPlays({
//       Name: "ADORING FANS",
//       Text: "Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             Filter: "attribute",
//             Value: "cost",
//             Comparison: { operator: "lte", value: 2 },
//           },
//         ],
//       },
//       Optional: true,
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "source", value: "trigger" }],
//           },
//         },
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//     ShiftAbility(4, "Stitch"),
//   ],
//   Flavour:
//     "The best part about a beachside concert is that there's always room for one more.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 6,
//   Strength: 3,
//   Willpower: 5,
//   Lore: 3,
//   Illustrator: "Simangaliso Sibaya",
//   Number: 23,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492708,
//   },
//   Rarity: "super_rare",
// };
//
