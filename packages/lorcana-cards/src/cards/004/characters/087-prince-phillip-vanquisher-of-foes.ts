// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import {
//   EvasiveAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const princePhillipVanquisherOfFoes: LorcanitoCharacterCard = {
//   Id: "dh6",
//   Reprints: ["wj7"],
//   MissingTestCase: true,
//   Name: "Prince Phillip",
//   Title: "Vanquisher of Foes",
//   Characteristics: ["hero", "floodborn", "prince"],
//   Text: "**Shift** 6 \n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**STRIKE TO THE HEART** When you play this character, banish all opposing damaged characters.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(6, "prince phillip"),
//     EvasiveAbility,
//     {
//       Type: "resolution",
//       Name: "Strike To The Heart",
//       Text: "When you play this character, banish all opposing damaged characters.",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "opponent" },
//               {
//                 Filter: "status",
//                 Value: "damaged",
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 9,
//   Lore: 3,
//   Strength: 6,
//   Willpower: 6,
//   Illustrator: "Randy Bishop",
//   Number: 87,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550581,
//   },
//   Rarity: "super_rare",
// };
//
