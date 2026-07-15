// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   DamageEffect,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// Import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const theMobSong: LorcanitoActionCard = {
//   Id: "h6n",
//   Reprints: ["fj5"],
//   Name: "The Mob Song",
//   Characteristics: ["action", "song"],
//   Text: "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
//   Type: "action",
//   Abilities: [
//     SingerTogetherAbility(10),
//     {
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 3,
//           Target: {
//             Type: "card",
//             Value: 3,
//             UpTo: true,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: ["character", "location"] },
//             ],
//           },
//         } as DamageEffect,
//       ],
//     },
//   ],
//   Colors: ["steel"],
//   Cost: 10,
//   Illustrator: "Ian MacDonald",
//   Number: 198,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547841,
//   },
//   Rarity: "uncommon",
// };
//
