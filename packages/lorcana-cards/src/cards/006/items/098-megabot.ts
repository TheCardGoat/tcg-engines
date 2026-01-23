import type { ItemCard } from "@tcg/lorcana-types";

export const megabot: ItemCard = {
  id: "137",
  cardType: "item",
  name: "MegaBot",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "HAPPY FACE This item enters play exerted.\nDESTROY! {E}, Banish this item - Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.",
  cost: 2,
  cardNumber: 98,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8d39122e87e1603287c1b7a7ea6692a829361d9d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import {
//   destroy,
//   happyFace,
// } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const megabot: LorcanitoItemCard = {
//   id: "zgw",
//   missingTestCase: true,
//   name: "Megabot",
//   characteristics: ["item"],
//   text: "HAPPY FACE This item enters play exerted.\nDESTROY! {E}, Banish this item - Choose one:\n* Banish chosen item.\n* Banish chosen damaged character.",
//   type: "item",
//   abilities: [happyFace, destroy],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Kamil Murzyn",
//   number: 98,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588322,
//   },
//   rarity: "uncommon",
// };
//
