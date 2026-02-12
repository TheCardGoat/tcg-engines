// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// Import {
//   ChosenCharacter,
//   ThisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// Export const camiloMadrigalPrankster: LorcanitoCharacterCard = {
//   Id: "oct",
//   Reprints: ["bij"],
//   MissingTestCase: true,
//   Name: "Camilo Madrigal",
//   Title: "Prankster",
//   Characteristics: ["storyborn", "ally", "madrigal"],
//   Text: "**MANY FORMS** At the start of your turn, you may chose one:\n\n\n• This character gets +1 {L} this turn.\n\n\n• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_",
//   Type: "character",
//   Abilities: [
//     AtTheStartOfYourTurn({
//       Name: "Many Forms",
//       Text: "At the start of your turn, you may chose one:\n\n\n• This character gets +1 {L} this turn.\n\n\n• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_",
//       Effects: [
//         {
//           Type: "modal",
//           // TODO: Get rid of target
//           Target: chosenCharacter,
//           Modes: [
//             {
//               Id: "1",
//               Text: "This character gets +1 {L} this turn.",
//               Effects: [
//                 {
//                   Type: "attribute",
//                   Attribute: "lore",
//                   Amount: 1,
//                   Modifier: "add",
//                   Duration: "turn",
//                   Target: thisCharacter,
//                 },
//               ],
//             },
//             {
//               Id: "2",
//               Text: "This character gain **Challenger** +2 this turn.",
//               Effects: [
//                 {
//                   Type: "ability",
//                   Ability: "challenger",
//                   Amount: 2,
//                   Modifier: "add",
//                   Duration: "turn",
//                   Target: thisCharacter,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Emily Abeydeera",
//   Number: 40,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 548203,
//   },
//   Rarity: "uncommon",
// };
//
