import type { CharacterCard } from "@tcg/op-types";
import { op11Zeus106I18n } from "./106-zeus.i18n.ts";

export const op11Zeus106: CharacterCard = {
  id: "OP11-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP11",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-106_p1.jpg",
      imageId: "OP11-106_p1",
    },
  ],
  effect:
    "[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Zeus106I18n,
};
