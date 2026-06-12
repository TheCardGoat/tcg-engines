import type { ItemCard } from "@tcg/lorcana-types";
import { madHattersTeapotI18n } from "./066-mad-hatters-teapot.i18n";

export const madHattersTeapot: ItemCard = {
  id: "fMK",
  canonicalId: "ci_fMK",
  reprints: ["set6-066"],
  cardType: "item",
  name: "Mad Hatter's Teapot",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 66,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_075482312a124f6585f77be3a693f63f",
    tcgPlayer: 578175,
  },
  text: [
    {
      title: "NO ROOM, NO ROOM",
      description: "{E}, 1 {I} — Each opponent puts the top card of their deck into their discard.",
    },
  ],
  abilities: [
    {
      id: "2bj-1",
      name: "NO ROOM, NO ROOM",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "mill",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "NO ROOM, NO ROOM {E}, 1 {I} — Each opponent puts the top card of their deck into their discard.",
    },
  ],
  i18n: madHattersTeapotI18n,
};
