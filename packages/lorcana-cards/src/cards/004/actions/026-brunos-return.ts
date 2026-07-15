// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const brunosReturn: LorcanitoActionCard = {
//   Id: "azx",
//   Reprints: ["cr8"],
//   Name: "Bruno's Return",
//   Characteristics: ["action"],
//   Text: "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Text: "Return a character card from your discard to your hand.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "hand",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//         {
//           Type: "heal",
//           Amount: 2,
//           UpTo: true,
//           Target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   Colors: ["amber"],
//   Cost: 2,
//   Illustrator: "Cristian Romero",
//   Number: 26,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 548206,
//   },
//   Rarity: "uncommon",
// };
//
