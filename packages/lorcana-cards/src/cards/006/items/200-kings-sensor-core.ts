import type { ItemCard } from "@tcg/lorcana-types";

export const kingsSensorCore: ItemCard = {
  id: "1jp",
  cardType: "item",
  name: "King's Sensor Core",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "006",
  text: "SYMBOL OF ROYALTY Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)\nROYAL SEARCH {E}, 2 {I} – Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.",
  cost: 3,
  cardNumber: 200,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c8c598bbf7c1e8cecb91d6da44108cd014214d0b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import {
//   royalSearch,
//   simboulOfRoyalty,
// } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const kingsSensorCore: LorcanitoItemCard = {
//   id: "nrj",
//   name: "King's Sensor Core",
//   characteristics: ["item"],
//   text: "**SYMBOL OF ROYALTY** Your Prince and King characters gain Resist +1. (Damage dealt to them is reduced by 1.)\n**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it's a Prince or King character card, you may put that card into your hand. Otherwise, put it on the top of your deck.",
//   type: "item",
//   abilities: [simboulOfRoyalty, royalSearch],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Juan Diego Leon",
//   number: 200,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592022,
//   },
//   rarity: "rare",
// };
//
