// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const sisuDaringVisitor: LorcanitoCharacterCard = {
//   Id: "npe",
//   Reprints: ["eyu"],
//   MissingTestCase: true,
//   Name: "Sisu",
//   Title: "Daring Visitor",
//   Characteristics: ["hero", "storyborn", "dragon", "deity"],
//   Text: "**Evasive**\n\n\n**BRING ON THE HEAT!** When you play this character, banish chosen opposing character with 1 {S} or less.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     WhenYouPlayThis({
//       Name: "Bring on the heat!",
//       Text: "When you play this character, banish chosen opposing character with 1 {S} or less.",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "opponent" },
//               {
//                 Filter: "attribute",
//                 Value: "strength",
//                 Comparison: { operator: "lte", value: 1 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "Come on - what's the worst that can happen?",
//   Colors: ["ruby"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 1,
//   Lore: 1,
//   Illustrator: "Otto Paredes",
//   Number: 123,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 550600,
//   },
//   Rarity: "uncommon",
// };
//
