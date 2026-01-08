import type { ItemCard } from "@tcg/lorcana-types";

export const spaghettiDinner: ItemCard = {
  id: "1bi",
  cardType: "item",
  name: "Spaghetti Dinner",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "FINE DINING {E}, 1 {I} — If you have 2 or more characters in play, gain 1 lore.",
  cost: 2,
  cardNumber: 42,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a9a9ca2c6a1c80726daf8f1358630264d440c24b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { spaghettiDinnerAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const spaghettiDinner: LorcanitoItemCard = {
//   id: "kpp",
//   name: "Spaghetti Dinner",
//   characteristics: ["item"],
//   text: "FINE DINING {E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
//   type: "item",
//   abilities: [spaghettiDinnerAbility],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Roberto Gatto",
//   number: 42,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618164,
//   },
//   rarity: "common",
// };
//
