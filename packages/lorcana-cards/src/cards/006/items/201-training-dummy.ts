import type { ItemCard } from "@tcg/lorcana-types";

export const trainingDummy: ItemCard = {
  id: "1dj",
  cardType: "item",
  name: "Training Dummy",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "006",
  text: "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  cardNumber: 201,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b2ffd3347d1cead4ec8b7dece53827b4b191dc01",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { handleWithCare } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const trainingDummy: LorcanitoItemCard = {
//   id: "r2x",
//   missingTestCase: true,
//   name: "Training Dummy",
//   characteristics: ["item"],
//   text: "HANDLE WITH CARE {E}, 2 {I} – Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
//   type: "item",
//   abilities: [handleWithCare],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Valentina Grzbuso",
//   number: 201,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588158,
//   },
//   rarity: "uncommon",
// };
//
