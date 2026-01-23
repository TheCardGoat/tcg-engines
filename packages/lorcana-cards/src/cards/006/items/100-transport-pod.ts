import type { ItemCard } from "@tcg/lorcana-types";

export const transportPod: ItemCard = {
  id: "yne",
  cardType: "item",
  name: "Transport Pod",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.",
  cost: 1,
  cardNumber: 100,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ce1dbdc93b5f783cc8edf3d2c379ccc8c0dc807",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { giveThemAShow } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const transportPod: LorcanitoItemCard = {
//   id: "oas",
//   name: "Transport Pod",
//   characteristics: [],
//   text: "GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.",
//   type: "item",
//   abilities: [giveThemAShow],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Eva Widermann",
//   number: 100,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593046,
//   },
//   rarity: "uncommon",
// };
//
