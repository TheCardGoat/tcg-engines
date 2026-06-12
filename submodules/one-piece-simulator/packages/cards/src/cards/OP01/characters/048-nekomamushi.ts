import type { CharacterCard } from "@tcg/op-types";
import { op01Nekomamushi048I18n } from "./048-nekomamushi.i18n.ts";

export const op01Nekomamushi048: CharacterCard = {
  id: "OP01-048",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-048_p1.jpg",
      imageId: "OP01-048_p1",
    },
  ],
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters with a cost of 3 or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01Nekomamushi048I18n,
};
