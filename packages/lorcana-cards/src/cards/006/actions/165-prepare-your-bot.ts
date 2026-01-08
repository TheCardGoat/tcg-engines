import type { ActionCard } from "@tcg/lorcana-types";

export const prepareYourBot: ActionCard = {
  id: "ho1",
  cardType: "action",
  name: "Prepare Your Bot",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
  cost: 1,
  cardNumber: 165,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3fc04fcbbbf9a961ececd00cd38396d95d1e1f9f",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   readyAndCantQuest,
//   readyChosenItem,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const prepareYourBot: LorcanitoActionCard = {
//   id: "ht1",
//   missingTestCase: true,
//   name: "Prepare Your Bot",
//   characteristics: ["action"],
//   text: "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
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
//               text: "Ready chosen item.",
//               effects: [readyChosenItem],
//             },
//             {
//               id: "2",
//               text: "Ready chosen Robot character. They can't quest for the rest of this turn.",
//               effects: readyAndCantQuest({
//                 type: "card",
//                 value: 1,
//                 filters: [
//                   { filter: "type", value: "character" },
//                   { filter: "zone", value: "play" },
//                   { filter: "characteristics", value: ["robot"] },
//                 ],
//               }),
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Ian MacDonald",
//   number: 165,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587504,
//   },
//   rarity: "uncommon",
// };
//
