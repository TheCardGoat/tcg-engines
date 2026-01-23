import type { ItemCard } from "@tcg/lorcana-types";

export const kanineKrunchies: ItemCard = {
  id: "3wn",
  cardType: "item",
  name: "Kanine Krunchies",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "007",
  text: "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.",
  cost: 1,
  cardNumber: 43,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0e14bb8a862da981efa44f59d4328c79ee92dba1",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { kanineKrunchiesAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const kanineKrunchies: LorcanitoItemCard = {
//   id: "zay",
//   name: "Kanine Krunchies",
//   characteristics: ["item"],
//   text: "YOU CAN BE A CHAMPION, TOO Your Puppy characters get +1 {W}.",
//   type: "item",
//   abilities: [kanineKrunchiesAbility],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Juan Diego Leon",
//   number: 43,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618246,
//   },
//   rarity: "common",
// };
//
