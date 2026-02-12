// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { wheneverACharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { readyThisItem } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const robinsBow: LorcanitoItemCard = {
//   Id: "b4u",
//   MissingTestCase: true,
//   Name: "Robin's Bow",
//   Characteristics: ["item"],
//   Text: "**FOREST'S GIFT** {E} – Deal 1 damage to chosen damaged character or location.\n\n\n**A BIT OF A LARK** Whenever a character of yours named Robin Hood quests, you may ready this item.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "FOREST'S GIFT",
//       Text: "{E} – Deal 1 damage to chosen damaged character or location.",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: ["location", "character"] },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "status",
//                 Value: "damage",
//                 Comparison: { operator: "gte", value: 1 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     WheneverACharacterQuests({
//       Name: "A bit of a Lark",
//       Text: "Whenever a character of yours named Robin Hood quests, you may ready this item.",
//       Optional: true,
//       Effects: [readyThisItem],
//       CharacterFilter: [
//         {
//           Filter: "attribute",
//           Value: "name",
//           Comparison: { operator: "eq", value: "robin hood" },
//         },
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//         { filter: "zone", value: "play" },
//       ],
//     }),
//   ],
//   Flavour: "The forest always provides just what you need. \n–Robin Hood",
//   Colors: ["emerald"],
//   Cost: 3,
//   Illustrator: "McKay Anderson",
//   Number: 98,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 537827,
//   },
//   Rarity: "uncommon",
// };
//
