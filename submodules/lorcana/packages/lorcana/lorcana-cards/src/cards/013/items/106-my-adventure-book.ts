import type { ItemCard } from "@tcg/lorcana-types";
import { myAdventureBookI18n } from "./106-my-adventure-book.i18n";

export const myAdventureBook: ItemCard = {
  id: "ph9",
  canonicalId: "ci_ph9",
  slug: "lorcana-ci_ph9",
  printings: [
    {
      id: "set13-106",
      artId: "set13-106",
      setCode: "set13",
      collectorNumber: "106",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-106"],
  cardType: "item",
  name: "My Adventure Book",
  inkType: ["emerald"],
  franchise: "Up",
  set: "013",
  cardNumber: 106,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_a2348103280d45639331013b3de78bf8",
  },
  text: [
    {
      title: "NEW MEMORIES",
      description:
        "{E}, 1{I} — Reveal the top card of your deck. If it's a non-character card or a character card named Kevin, put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  abilities: [
    {
      id: "ph9-1",
      name: "NEW MEMORIES",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "reveal-and-route",
        target: "CONTROLLER",
        routes: [
          {
            condition: {
              type: "or",
              conditions: [
                {
                  type: "not",
                  condition: {
                    type: "revealed-is-card-type",
                    cardType: "character",
                  },
                },
                {
                  type: "revealed-is-character-named",
                  name: "Kevin",
                },
              ],
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
      text: "NEW MEMORIES {E}, 1 {I} - Reveal the top card of your deck. If it's a non-character card or a character card named Kevin, put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  i18n: myAdventureBookI18n,
};
