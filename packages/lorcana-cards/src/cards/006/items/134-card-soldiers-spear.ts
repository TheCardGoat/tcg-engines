import type { ItemCard } from "@tcg/lorcana-types";

export const cardSoldiersSpear: ItemCard = {
  id: "1ul",
  cardType: "item",
  name: "Card Soldier's Spear",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
  cost: 1,
  cardNumber: 134,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee955829a8966f3315097e2637aafd172c098344",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { aSuitableWeapon } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const cardSoldiersSpear: LorcanitoItemCard = {
//   id: "bka",
//   missingTestCase: true,
//   name: "Card Soldier's Spear",
//   characteristics: ["item"],
//   text: "A SUITABLE WEAPON Your damaged characters get +1 {S}.",
//   type: "item",
//   abilities: [aSuitableWeapon],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Kristen Kuloba",
//   number: 134,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588342,
//   },
//   rarity: "uncommon",
// };
//
