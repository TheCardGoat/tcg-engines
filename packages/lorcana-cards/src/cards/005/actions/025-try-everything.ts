import type { ActionCard } from "@tcg/lorcana-types";

export const tryEverything: ActionCard = {
  id: "2vk",
  cardType: "action",
  name: "Try Everything",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "005",
  text: "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 25,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0a5e3974022258c07e0af28d56ba5709c9bb85e9",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const tryEverything: LorcanitoActionCard = {
//   id: "vjj",
//   missingTestCase: true,
//   name: "Try Everything",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n<br>Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Remove up to 3 damage from chosen character and ready them. They can’t quest or challenge for the rest of this turn.",
//       effects: [
//         {
//           type: "heal",
//           amount: 3,
//           upTo: true,
//           target: chosenCharacter,
//         },
//         ...readyAndCantQuest(chosenCharacter),
//       ],
//     },
//   ],
//   flavour: "I want to try even though I could fail",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 4,
//   illustrator: "Nicolas Ky",
//   number: 25,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559171,
//   },
//   rarity: "uncommon",
// };
//
