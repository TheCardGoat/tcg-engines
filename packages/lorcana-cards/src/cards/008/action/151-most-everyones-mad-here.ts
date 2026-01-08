// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   mayBanish,
//   youGainLore,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const mostEveryonesMadHere: LorcanitoActionCard = {
//   id: "isu",
//   name: "Most Everyone's Mad Here",
//   characteristics: ["action"],
//   text: "Gain lore equal to the damage on chosen character, then banish them.",
//   type: "action",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 7,
//   illustrator: "Leonardo Giammichele",
//   number: 151,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631451,
//   },
//   rarity: "rare",
//   abilities: [
//     {
//       type: "resolution",
//       dependentEffects: true,
//       effects: [
//         {
//           type: "create-layer-based-on-target",
//           target: chosenCharacter,
//           resolveAmountBeforeCreatingLayer: true,
//           effects: [
//             youGainLore({
//               dynamic: true,
//               target: { attribute: "damage" },
//             }),
//           ],
//         },
//
//         mayBanish(chosenCharacter),
//       ],
//     },
//   ],
// };
//
