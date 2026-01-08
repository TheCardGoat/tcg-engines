import type { ActionCard } from "@tcg/lorcana-types";

export const goodJob: ActionCard = {
  id: "1q8",
  cardType: "action",
  name: "Good Job!",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "006",
  text: "Chosen character gets +1 {L} this turn.",
  cost: 1,
  cardNumber: 27,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e18dacf13ba36a2bb5ba634fdc8789594b85507a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const goodJob: LorcanitoActionCard = {
//   id: "jmf",
//   name: "Good Job!",
//   characteristics: ["action"],
//   text: "Chosen character gets +1 {L} this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Good Job!",
//       text: "Chosen character gets +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Carlos Gomes Cabral",
//   number: 27,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591977,
//   },
//   rarity: "common",
// };
//
