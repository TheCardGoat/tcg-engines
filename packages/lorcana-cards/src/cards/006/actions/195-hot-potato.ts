import type { ActionCard } from "@tcg/lorcana-types";

export const hotPotato: ActionCard = {
  id: "jnj",
  cardType: "action",
  name: "Hot Potato",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Choose one:\n- Deal 2 damage to chosen character.\n- Banish chosen item.",
  cost: 3,
  cardNumber: 195,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "46d569174be105bf3722b7146e7d4b850b976412",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   banishChosenItem,
//   dealDamageEffect,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const hotPotato: LorcanitoActionCard = {
//   id: "uzc",
//   missingTestCase: true,
//   name: "Hot Potato",
//   characteristics: ["action"],
//   text: "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
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
//               text: "Deal 2 damage to chosen character.",
//               effects: [dealDamageEffect(2, chosenCharacter)],
//             },
//             {
//               id: "2",
//               text: "Banish chosen item.",
//               effects: [banishChosenItem],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour: '"This is not going to end well." \n−Pleakley',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//
//   illustrator: "Nicolas Ky",
//   number: 195,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578234,
//   },
//   rarity: "uncommon",
// };
//
