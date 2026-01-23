import type { ActionCard } from "@tcg/lorcana-types";

export const dodge: ActionCard = {
  id: "2c5",
  cardType: "action",
  name: "Dodge!",
  inkType: ["emerald"],
  set: "004",
  text: "Chosen character gains Ward and Evasive until the start of your next turn. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
  cost: 2,
  cardNumber: 93,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "086cbb4a18c9cc21f6ba04e1011c055bd4c551a4",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const dodge: LorcanitoActionCard = {
//   id: "ysq",
//   name: "Dodge!",
//   characteristics: ["action"],
//   text: "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "ability",
//           ability: "ward",
//           duration: "next_turn",
//           modifier: "add",
//           until: true,
//           target: chosenCharacter,
//         },
//         {
//           type: "ability",
//           ability: "evasive",
//           duration: "next_turn",
//           modifier: "add",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Missed me, you doggone bully!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Wouter Bruneel",
//   number: 93,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550584,
//   },
//   rarity: "common",
// };
//
