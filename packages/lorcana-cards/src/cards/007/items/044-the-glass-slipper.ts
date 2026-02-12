import type { ItemCard } from "@tcg/lorcana-types";

export const theGlassSlipper: ItemCard = {
  abilities: [
    {
      effect: {
        type: "search-deck",
        putInto: "hand",
        shuffle: true,
      },
      id: "1wf-2",
      text: "SEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
      type: "static",
    },
  ],
  cardNumber: 44,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "f5a235b7654245ada9482fa791d327f69903983e",
  },
  franchise: "Cinderella",
  id: "1wf",
  inkType: ["amber"],
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  name: "The Glass Slipper",
  set: "007",
  text: "PERFECT PAIR You may only have 2 copies of The Glass Slipper in your deck.\nSEARCH THE KINGDOM Banish this item, {E} one of your Prince characters – Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
};
