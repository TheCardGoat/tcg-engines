import type { CharacterCard } from "@tcg/op-types";
import { op06Perona093I18n } from "./093-perona.i18n.ts";

export const op06Perona093: CharacterCard = {
  id: "OP06-093",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-093_p1.jpg",
      imageId: "OP06-093_p1",
    },
  ],
  effect:
    "[On Play] If your opponent has 5 or more cards in their hand, choose one:\n• Your opponent trashes 1 card from their hand.\n• Give up to 1 of your opponent's Characters -3 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "trashFromHand",
                  player: "opponent",
                  amount: 1,
                },
              ],
              [
                {
                  action: "modifyCost",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                  value: -3,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op06Perona093I18n,
};
