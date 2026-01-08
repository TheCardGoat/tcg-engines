// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
// import {
//   chosenCharacter,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const camiloMadrigalPrankster: LorcanitoCharacterCard = {
//   id: "oct",
//   reprints: ["bij"],
//   missingTestCase: true,
//   name: "Camilo Madrigal",
//   title: "Prankster",
//   characteristics: ["storyborn", "ally", "madrigal"],
//   text: "**MANY FORMS** At the start of your turn, you may chose one:\n\n\n• This character gets +1 {L} this turn.\n\n\n• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_",
//   type: "character",
//   abilities: [
//     atTheStartOfYourTurn({
//       name: "Many Forms",
//       text: "At the start of your turn, you may chose one:\n\n\n• This character gets +1 {L} this turn.\n\n\n• This character gain **Challenger** +2 this turn. _(While challenging, this character gets +2 {S}.)_",
//       effects: [
//         {
//           type: "modal",
//           // TODO: Get rid of target
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "This character gets +1 {L} this turn.",
//               effects: [
//                 {
//                   type: "attribute",
//                   attribute: "lore",
//                   amount: 1,
//                   modifier: "add",
//                   duration: "turn",
//                   target: thisCharacter,
//                 },
//               ],
//             },
//             {
//               id: "2",
//               text: "This character gain **Challenger** +2 this turn.",
//               effects: [
//                 {
//                   type: "ability",
//                   ability: "challenger",
//                   amount: 2,
//                   modifier: "add",
//                   duration: "turn",
//                   target: thisCharacter,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Emily Abeydeera",
//   number: 40,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548203,
//   },
//   rarity: "uncommon",
// };
//
