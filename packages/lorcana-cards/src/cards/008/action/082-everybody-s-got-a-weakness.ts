// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenOpposingCharacter,
//   yourCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   drawXCards,
//   moveDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const everybodysGotAWeakness: LorcanitoActionCard = {
//   id: "j44",
//   name: "Everybody's Got A Weakness",
//   characteristics: ["action"],
//   text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         moveDamageEffect({
//           amount: 1,
//           from: yourCharacters,
//           to: chosenOpposingCharacter,
//         }),
//         drawXCards({
//           dynamic: true,
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             { filter: "status", value: "damaged" },
//           ],
//         }),
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   illustrator: "Linh Dang",
//   number: 82,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631832,
//   },
//   rarity: "rare",
// };
//
