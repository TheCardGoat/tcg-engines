import type { ActionCard } from "@tcg/lorcana-types";

export const everAsBefore: ActionCard = {
  id: "1br",
  cardType: "action",
  name: "Ever as Before",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "Remove up to 2 damage from any number of chosen characters.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 162,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ac2e4ae31b17ef873ac04d7effc1655e403418b9",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { anyNumberOfChosenCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const everAsBefore: LorcanitoActionCard = {
//   id: "nlq",
//   missingTestCase: true,
//   name: "Ever as Before",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can {E} to sing this song for free.)_<br/>Remove up to 2 damage from any number of chosen characters.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: anyNumberOfChosenCharacters,
//         },
//       ],
//     },
//   ],
//   flavour: "Ever just as sure\nAs the sun will rise",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Grace Tran",
//   number: 162,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561970,
//   },
//   rarity: "common",
// };
//
