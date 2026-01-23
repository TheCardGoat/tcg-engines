// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoActionCard,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
//
// import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";
//
// const characterOfYoursWithACardUnderThem: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     { filter: "has_card_under_them" },
//     { filter: "owner", value: "self" },
//     { filter: "type", value: "character" },
//   ],
// };
//
// export const timeToGo: LorcanitoActionCard = {
//   id: "or3",
//   name: "Time to Go!",
//   characteristics: ["action"],
//   text: "Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.",
//   type: "action",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Matthew Robert Davies",
//   number: 131,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660003,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "target-conditional",
//           target: chosenCharacterOfYours,
//           effects: [
//             {
//               type: "banish",
//               target: characterOfYoursWithACardUnderThem,
//             },
//             drawXCards(3),
//           ],
//           fallback: [
//             {
//               type: "banish",
//               target: chosenCharacterOfYours,
//             },
//             drawXCards(2),
//           ],
//         },
//       ],
//     },
//   ],
// };
//
