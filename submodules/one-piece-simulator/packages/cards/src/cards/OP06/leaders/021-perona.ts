import type { LeaderCard } from "@tcg/op-types";
import { op06Perona021I18n } from "./021-perona.i18n.ts";

export const op06Perona021: LeaderCard = {
  id: "OP06-021",
  cardType: "leader",
  color: ["green", "black"],
  rarity: "L",
  setId: "OP06",
  power: 5000,
  life: 4,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-021_p1.jpg",
      imageId: "OP06-021_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] Choose one:\n• Rest up to 1 of your opponent's Characters with a cost of 4 or less.\n• Give up to 1 of your opponent's Characters -1 cost tot your opponent's during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        value: 4,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Perona021I18n,
};
