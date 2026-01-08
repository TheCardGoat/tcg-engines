import type { ActionCard } from "@tcg/lorcana-types";

export const swingIntoAction: ActionCard = {
  id: "r30",
  cardType: "action",
  name: "Swing into Action",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 62,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "619c55ff131a58ac8714449f5ee1788379659e58",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterGainsRush } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const swingIntoAction: LorcanitoActionCard = {
//   id: "bho",
//   name: "Swing Into Action",
//   characteristics: ["action"],
//   text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [chosenCharacterGainsRush],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   illustrator: "Wouter Bruneel",
//   number: 62,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550571,
//   },
//   rarity: "common",
// };
//
