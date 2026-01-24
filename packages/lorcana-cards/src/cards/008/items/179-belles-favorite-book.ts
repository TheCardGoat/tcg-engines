import type { ItemCard } from "@tcg/lorcana-types";

export const bellesFavoriteBook: ItemCard = {
  id: "1gu",
  cardType: "item",
  name: "Belle's Favorite Book",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "CHAPTER THREE {E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  cardNumber: 179,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "be83ae44047d977d177acf42b3c89db7cebcdc03",
  },
  abilities: [
    {
      id: "1gu-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "CHAPTER THREE {E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
};
