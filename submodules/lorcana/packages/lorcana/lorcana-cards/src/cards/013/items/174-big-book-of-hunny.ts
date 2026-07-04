import type { ItemCard } from "@tcg/lorcana-types";
import { bigBookOfHunnyI18n } from "./174-big-book-of-hunny.i18n";

export const bigBookOfHunny: ItemCard = {
  id: "Es5",
  canonicalId: "ci_Es5",
  slug: "lorcana-ci_Es5",
  printings: [
    {
      id: "set13-174",
      artId: "set13-174",
      setCode: "set13",
      collectorNumber: "174",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-174"],
  cardType: "item",
  name: "Big Book of Hunny",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 174,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_89adca57e54540868bf280ac2deaaa57",
  },
  text: [
    {
      title: "INVOKE HUNNY",
      description:
        "{E}, 2 {I} — Reveal the top card of your deck. If it's a Hunny card, put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  abilities: [
    {
      id: "Es5-1",
      name: "INVOKE HUNNY",
      text: "INVOKE HUNNY {E}, 2 {I} - Reveal the top card of your deck. If it's a Hunny card, put it into your hand. Otherwise, put it on the bottom of your deck.",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "reveal-and-route",
        target: "CONTROLLER",
        routes: [
          {
            condition: {
              type: "revealed-has-classification",
              classification: "Hunny",
            },
            destination: {
              zone: "hand",
            },
          },
        ],
        fallback: {
          zone: "deck-bottom",
        },
      },
    },
  ],
  i18n: bigBookOfHunnyI18n,
};
