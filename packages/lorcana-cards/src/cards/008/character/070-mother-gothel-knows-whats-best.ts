// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// Import {
//   AnotherChosenCharacterOfYours,
//   ParentsTarget,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import {
//   ChosenCharacterGainsChallenger,
//   ChosenCharacterOfYoursGainsWhenBanishedReturnToHand,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const motherGothelKnowsWhatsBest: LorcanitoCharacterCard = {
//   Id: "pwy",
//   Name: "Mother Gothel",
//   Title: "Knows What's Best",
//   Characteristics: ["storyborn", "villain", "sorcerer"],
//   Text: "LOOK WHAT YOU'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +1 {S} while challenging.)",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThis({
//       Name: "LOOK WHAT YOU'VE DONE",
//       Text: "When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +1 {S} while challenging.)",
//       Optional: true,
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 2,
//           // TODO/NOTE: this character incorrectly shows up in target selection window.
//           //  An error appears if this character is selected, though.
//           Target: anotherChosenCharacterOfYours,
//           AfterEffect: [
//             {
//               Type: "create-layer-based-on-target",
//               Target: {} as CardEffectTarget, // uses parent target
//               Effects: [
//                 {
//                   ...chosenCharacterOfYoursGainsWhenBanishedReturnToHand,
//                   Target: parentsTarget,
//                 },
//                 {
//                   ...chosenCharacterGainsChallenger(1),
//                   Target: parentsTarget,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   Inkwell: false,
//   Colors: ["amethyst", "ruby"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 3,
//   Illustrator: "Joel DuQue",
//   Number: 70,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631397,
//   },
//   Rarity: "rare",
//   Lore: 1,
// };
//
