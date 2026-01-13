import type { ActionCard } from "@tcg/lorcana-types";

export const duckForCover: ActionCard = {
  id: "13l",
  cardType: "action",
  name: "Duck for Cover!",
  inkType: ["steel"],
  set: "005",
  text: "Chosen character gains Resist +1 and Evasive this turn. (Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)",
  cost: 2,
  cardNumber: 198,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8ec09ec81b578d2b3836f585a32e058381fe846c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacterGainsEvasive,
//   chosenCharacterGainsResist,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const duckForCover: LorcanitoActionCard = {
//   id: "jqo",
//   name: "Duck for Cover!",
//   characteristics: ["action"],
//   text: "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
//       effects: [
//         chosenCharacterGainsResist(1, "turn"),
//         chosenCharacterGainsEvasive,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Gianluca Barone",
//   number: 198,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561850,
//   },
//   rarity: "common",
// };
//
