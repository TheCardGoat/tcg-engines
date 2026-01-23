import type { ActionCard } from "@tcg/lorcana-types";

export const wakeUpAlice: ActionCard = {
  id: "7tg",
  cardType: "action",
  name: "Wake Up, Alice!",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "Return chosen damaged character to their player's hand.",
  cost: 1,
  cardNumber: 116,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1c2d6362749cb836c4d2e5f90fe707296e30c1fc",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { wakeUpAliceAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const wakeUpAlice: LorcanitoActionCard = {
//   id: "a3c",
//   name: "Wake Up, Alice!",
//   characteristics: ["action"],
//   text: "Return chosen damaged character to their player's hand.",
//   type: "action",
//   abilities: [wakeUpAliceAbility],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Valentina Graziano",
//   number: 116,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618258,
//   },
//   rarity: "common",
// };
//
