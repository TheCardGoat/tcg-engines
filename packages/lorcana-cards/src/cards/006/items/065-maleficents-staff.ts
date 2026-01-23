import type { ItemCard } from "@tcg/lorcana-types";

export const maleficentsStaff: ItemCard = {
  id: "1uj",
  cardType: "item",
  name: "Maleficent's Staff",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "006",
  text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
  cost: 2,
  cardNumber: 65,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f0af7b77ab79602de64eaa232f48153d20f4cada",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { backFools } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const maleficentsStaff: LorcanitoItemCard = {
//   id: "o37",
//   name: "Maleficent's Staff",
//   characteristics: ["item"],
//   text: "BACK, FOOLS! Whenever one of your opponents' characters, items, or locations is returned to their hand from play, gain 1 lore.",
//   type: "item",
//   abilities: [backFools],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Gabriel Angelo",
//   number: 65,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588369,
//   },
//   rarity: "rare",
// };
//
