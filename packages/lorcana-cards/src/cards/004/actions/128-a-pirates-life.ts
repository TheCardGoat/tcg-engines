// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const aPiratesLife: LorcanitoActionCard = {
//   Id: "u5v",
//   Reprints: ["t0s"],
//   Name: "A Pirate's Life",
//   Characteristics: ["action", "song"],
//   Text: "**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_\n\n\nEach opponent loses 2 lore. You gain 2 lore.",
//   Type: "action",
//   Flavour: "Give me a career\nAs a buccaneer",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 6,
//   Illustrator: "Valentina Graziuso",
//   Number: 128,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547843,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     SingerTogetherAbility(6),
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "lore",
//           Modifier: "subtract",
//           Amount: 2,
//           Target: opponent,
//         },
//         {
//           Type: "lore",
//           Modifier: "add",
//           Amount: 2,
//           Target: self,
//         },
//       ],
//     },
//   ],
// };
//
