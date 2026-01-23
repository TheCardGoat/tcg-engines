import type { ItemCard } from "@tcg/lorcana-types";

export const goldCoin: ItemCard = {
  id: "1fl",
  cardType: "item",
  name: "Gold Coin",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.",
  cost: 1,
  cardNumber: 133,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b829707b48b92131aeda84cb34488cb3ae66cffa",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { glitteringAccess } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const goldCoin: LorcanitoItemCard = {
//   id: "jmx",
//   missingTestCase: true,
//   name: "Gold Coin",
//   characteristics: ["item"],
//   text: "GLITTERING ACCESS {E}, 1 {I}, Banish this item – Ready chosen character of yours. They can't quest for the rest of this turn.",
//   type: "item",
//   abilities: [glitteringAccess],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Gabriel Angelo",
//   number: 133,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591124,
//   },
//   rarity: "common",
// };
//
