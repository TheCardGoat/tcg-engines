import type { ItemCard } from "@tcg/lorcana-types";

export const trainingStaff: ItemCard = {
  id: "1rn",
  cardType: "item",
  name: "Training Staff",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  text: "PRECISION STRIKE {E}, 1 {I} — Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 2,
  cardNumber: 204,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e59a60896a2cea72441d79546048b4cce3a5ed23",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { trainingStaffAbility } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const trainingStaff: LorcanitoItemCard = {
//   id: "lxr",
//   name: "Training Staff",
//   characteristics: ["item"],
//   text: "PRECISION STRIKE {E}, 1 {I} – Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
//   type: "item",
//   abilities: [trainingStaffAbility],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Roberto Gatto",
//   number: 204,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619526,
//   },
//   rarity: "super_rare",
// };
//
