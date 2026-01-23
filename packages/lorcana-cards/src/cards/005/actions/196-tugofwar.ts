// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   opposingCharactersWithEvasive,
//   opposingCharactersWithoutEvasive,
// } from "@lorcanito/lorcana-engine/abilities/target";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tugofwar: LorcanitoActionCard = {
//   id: "r3r",
//   name: "Tug-of-War",
//   characteristics: ["action"],
//   text: "Choose one:<br>• Deal 1 damage to each opposing character without **Evasive**.<br>• Deal 3 damage to each opposing character with **Evasive**.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "modal",
//           // TODO: Get rid of target
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "Deal 1 damage to each opposing character without **Evasive**.",
//               effects: [dealDamageEffect(1, opposingCharactersWithoutEvasive)],
//             },
//             {
//               id: "2",
//               text: "Deal 3 damage to each opposing character with **Evasive**.",
//               effects: [dealDamageEffect(3, opposingCharactersWithEvasive)],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 5,
//   illustrator: "Maxine Vee",
//   number: 196,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 557731,
//   },
//   rarity: "rare",
// };
//
