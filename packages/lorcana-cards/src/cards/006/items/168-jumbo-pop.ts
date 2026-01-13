import type { ItemCard } from "@tcg/lorcana-types";

export const jumboPop: ItemCard = {
  id: "lhl",
  cardType: "item",
  name: "Jumbo Pop",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  text: "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.",
  cost: 3,
  cardNumber: 168,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4d728e0fadc5e557dc4683c3c646e1cd6816ab7b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { thereYouGo } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const jumboPop: LorcanitoItemCard = {
//   id: "z6k",
//   missingTestCase: true,
//   name: "Jumbo Pop",
//   characteristics: ["item"],
//   text: "HERE YOU GO Banish this item – Remove up to 2 damage from each of your characters. Draw a card.",
//   type: "item",
//   abilities: [thereYouGo],
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 3,
//   illustrator: "Alexandra Hefez",
//   number: 168,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591138,
//   },
//   rarity: "common",
// };
//
