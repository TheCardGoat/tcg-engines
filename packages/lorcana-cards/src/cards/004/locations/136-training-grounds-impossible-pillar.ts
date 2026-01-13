import type { LocationCard } from "@tcg/lorcana-types";

export const trainingGroundsImpossiblePillar: LocationCard = {
  id: "etf",
  cardType: "location",
  name: "Training Grounds",
  version: "Impossible Pillar",
  fullName: "Training Grounds - Impossible Pillar",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  text: "STRENGTH OF MIND 1 {I} — Chosen character here gets +1 {S} this turn.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "35674539959c7627310558941f91d1dac8adff48",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const trainingGroundsImpossiblePillar: LorcanitoLocationCard = {
//   id: "c0i",
//   missingTestCase: true,
//   name: "Training Grounds",
//   title: "Impossible Pillar",
//   characteristics: ["location"],
//   text: "**STRENGTH OF MIND** 1 {I} - Chosen character here gets +1 {S} this turn.",
//   type: "location",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "ink", amount: 1 }],
//       text: "Strength of Mind",
//       name: "1 {I} - Chosen character here gets +1 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   moveCost: 1,
//   willpower: 5,
//   illustrator: "Matthew Oates",
//   number: 136,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550604,
//   },
//   rarity: "common",
// };
//
