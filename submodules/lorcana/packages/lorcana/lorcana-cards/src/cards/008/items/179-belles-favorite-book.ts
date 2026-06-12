import type { ItemCard } from "@tcg/lorcana-types";
import { bellesFavoriteBookI18n } from "./179-belles-favorite-book.i18n";

export const bellesFavoriteBook: ItemCard = {
  id: "FEr",
  canonicalId: "ci_FEr",
  reprints: ["set8-179"],
  cardType: "item",
  name: "Belle's Favorite Book",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 179,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_af0770252d004096b01a2056b3fe10e1",
    tcgPlayer: 631470,
  },
  text: [
    {
      title: "CHAPTER THREE",
      description:
        "{E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        banishItem: true,
      },
      effect: {
        exerted: true,
        facedown: true,
        source: "top-of-deck",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "1gu-1",
      name: "CHAPTER THREE",
      text: "CHAPTER THREE {E}, Banish one of your other items — Put the top card of your deck into your inkwell facedown and exerted.",
      type: "activated",
    },
  ],
  i18n: bellesFavoriteBookI18n,
};
