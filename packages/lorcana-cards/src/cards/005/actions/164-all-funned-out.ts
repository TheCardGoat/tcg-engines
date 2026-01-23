import type { ActionCard } from "@tcg/lorcana-types";

export const allFunnedOut: ActionCard = {
  id: "1mz",
  cardType: "action",
  name: "All Funned Out",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "Put chosen character of yours into your inkwell facedown and exerted.",
  cost: 1,
  cardNumber: 164,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d155c19a7e92dc65f53ce5d529431fec5fb85353",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const allFunnedOut: LorcanitoActionCard = {
//   id: "q4i",
//   missingTestCase: true,
//   name: "All Funned Out",
//   characteristics: ["action"],
//   text: "Put chosen character of yours into your inkwell facedown and exerted.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Put chosen character of yours into your inkwell facedown and exerted.",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: chosenCharacterOfYours,
//         },
//       ],
//     },
//   ],
//   flavour: "Pretty pathetic, huh?",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Adam Ford",
//   number: 164,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561971,
//   },
//   rarity: "uncommon",
// };
//
