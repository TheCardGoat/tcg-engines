import type { ItemCard } from "@tcg/lorcana-types";

export const coconutBasket: ItemCard = {
  id: "1d0",
  cardType: "item",
  name: "Coconut Basket",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "009",
  text: "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.",
  cost: 2,
  cardNumber: 169,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b0aeb53ff83e9f3f9443625e4f795527ca5d86f3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { coconutbasket as ogCoconutBasket } from "@lorcanito/lorcana-engine/cards/001/items/166-coconut-basket";
//
// export const coconutBasket: LorcanitoItemCard = {
//   ...ogCoconutBasket,
//   id: "bxv",
//   reprints: [ogCoconutBasket.id],
//   number: 169,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650103,
//   },
// };
//
