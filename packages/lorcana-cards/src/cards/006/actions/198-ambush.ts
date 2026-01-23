import type { ActionCard } from "@tcg/lorcana-types";

export const ambush: ActionCard = {
  id: "1dy",
  cardType: "action",
  name: "Ambush!",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
  cost: 3,
  cardNumber: 198,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b2f61c0f1fe547f2d70b3b68dc6bd2cdb8c76419",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacterOfYours,
//   chosenCharacterOrLocation,
//   thisCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ambush: LorcanitoActionCard = {
//   id: "s1l",
//   name: "Ambush!",
//   characteristics: ["action"],
//   text: "{E} one of your characters to deal damage equal to their {S} to chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenCharacterOfYours,
//           afterEffect: [
//             {
//               type: "create-layer-based-on-target",
//               // TODO: get rid of target
//               target: thisCharacter,
//               resolveAmountBeforeCreatingLayer: true,
//               effects: [
//                 dealDamageEffect(
//                   {
//                     dynamic: true,
//                     target: {
//                       attribute: "strength",
//                     },
//                   },
//                   chosenCharacterOrLocation,
//                 ),
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Ilaria Sposetti",
//   number: 198,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587971,
//   },
//   rarity: "rare",
// };
//
