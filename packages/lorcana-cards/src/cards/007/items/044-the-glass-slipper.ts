import type { ItemCard } from "@tcg/lorcana-types";

export const theGlassSlipper: ItemCard = {
  id: "1wf",
  cardType: "item",
  name: "The Glass Slipper",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "007",
  text: "PERFECT PAIR You may only have 2 copies of The Glass Slipper in your deck.\nSEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
  cost: 2,
  cardNumber: 44,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f5a235b7654245ada9482fa791d327f69903983e",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { searchTheKingdom } from "@lorcanito/lorcana-engine/cards/007/abilities";
//
// export const theGlassSlipper: LorcanitoItemCard = {
//   id: "lun",
//   name: "The Glass Slipper",
//   characteristics: ["item"],
//   text: "PERFECT PAIR You may only have 2 copies of The Glass Slipper in your deck.\n\nSEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
//   type: "item",
//   abilities: [searchTheKingdom],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Tania Soler",
//   number: 44,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618690,
//   },
//   rarity: "rare",
//   cardCopyLimit: 2,
// };
//
