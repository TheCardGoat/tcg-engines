import type { ItemCard } from "@tcg/lorcana-types";

export const bellesFavoriteBook: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      id: "1gu-1",
      text: "CHAPTER THREE {E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.",
      type: "activated",
    },
  ],
  cardNumber: 179,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "be83ae44047d977d177acf42b3c89db7cebcdc03",
  },
  franchise: "Beauty and the Beast",
  id: "1gu",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "Belle's Favorite Book",
  set: "008",
  text: "CHAPTER THREE {E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.",
};
