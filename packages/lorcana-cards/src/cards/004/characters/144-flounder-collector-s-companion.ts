// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const flounderCollectorsCompanion: LorcanitoCharacterCard = {
//   Id: "ti7",
//   Name: "Flounder",
//   Title: "Collector's Companion",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**Support** _(Whenever this character quests, you mad add their {S} to another chosen character's {S} this turn.)_\n\n\n**I'M NOT A GUPPY** If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
//   Type: "character",
//   Abilities: [
//     SupportAbility,
//     WhenYouPlayThisForEachYouPayLess({
//       Name: "I'M NOT A GUPPY",
//       Text: "If you have a character named Ariel in play, you pay 1 {I} less to play this character.",
//       Amount: 1,
//       Conditions: [
//         {
//           Type: "filter",
//           Comparison: {
//             Operator: "gte",
//             Value: 1,
//           },
//           Filters: [
//             ...chosenCharacterOfYours.filters,
//             {
//               Filter: "attribute",
//               Value: "name",
//               Comparison: { operator: "eq", value: "Ariel" },
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   Flavour: '"Ariel, Ariel! You won\'t believe what I found!"',
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 2,
//   Illustrator: "James C Mulligan",
//   Number: 144,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547687,
//   },
//   Rarity: "uncommon",
// };
//
