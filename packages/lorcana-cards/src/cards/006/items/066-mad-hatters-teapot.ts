import type { ItemCard } from "@tcg/lorcana-types";

export const madHattersTeapot: ItemCard = {
  id: "wjk",
  cardType: "item",
  name: "Mad Hatter's Teapot",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "NO ROOM, NO ROOM {E}, 1 {I} - Each opponent puts the top card of their deck into their discard.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7549f2439840b19bdfd1593d9b50b0e97f7dff7c",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { noRoomNoRoom } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const madHattersTeapot: LorcanitoItemCard = {
//   id: "n9n",
//   name: "Mad Hatter's Teapot",
//   characteristics: ["item"],
//   text: "**NO ROOM, NO ROOM**, {E}, 1 {I} – Each opponent puts the top card of their deck into their discard.",
//   type: "item",
//   abilities: [noRoomNoRoom],
//   flavour:
//     "Alice: My goodness, the tea missed the cup! \nMad Hatter: No, no, my dear—the cup missed the tea!",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//
//   illustrator: "Andrea Parisi",
//   number: 66,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578175,
//   },
//   rarity: "common",
// };
//
