// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const minnieMouseMusketeerChampion: LorcanitoCharacterCard = {
//   Id: "mkk",
//   Name: "Minnie Mouse",
//   Title: "Musketeer Champion",
//   Characteristics: ["hero", "dreamborn", "musketeer"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your character must chose one with Bodyguard if able.)_\n\n\n**DRAMATIC ENTERANCE** When you play this character, banish chosen opposing character with 5  {S} or more.",
//   Type: "character",
//   Abilities: [
//     BodyguardAbility,
//     {
//       Type: "resolution",
//       Name: "DRAMATIC ENTERANCE",
//       Text: "When you play this character, banish chosen opposing character with 5  {S} or more.",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "attribute",
//                 Value: "strength",
//                 Comparison: { operator: "gte", value: 5 },
//               },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   Colors: ["amber"],
//   Cost: 5,
//   Strength: 1,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Leonardo Giammichele",
//   Number: 17,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 548611,
//   },
//   Rarity: "super_rare",
// };
//
