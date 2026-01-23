import type { ActionCard } from "@tcg/lorcana-types";

export const makeThePotion: ActionCard = {
  id: "db6",
  cardType: "action",
  name: "Make the Potion",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "009",
  text: "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.",
  cost: 2,
  cardNumber: 98,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2ff92870c51a6d0ed82d95f43850abf04ef72c3d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { makeThePotion as makeThePotionAsOrig } from "@lorcanito/lorcana-engine/cards/004/actions/094-make-the-potion";
//
// export const makeThePotion: LorcanitoActionCard = {
//   ...makeThePotionAsOrig,
//   id: "iiv",
//   reprints: [makeThePotionAsOrig.id],
//   number: 98,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650036,
//   },
// };
//
