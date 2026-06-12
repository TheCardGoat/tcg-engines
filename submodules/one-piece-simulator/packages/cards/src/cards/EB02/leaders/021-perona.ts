import type { LeaderCard } from "@tcg/op-types";
import { eb02Perona021I18n } from "./021-perona.i18n.ts";

export const eb02Perona021: LeaderCard = {
  id: "OP06-021",
  cardType: "leader",
  color: ["green", "black"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] Choose one:\n• Rest up to 1 of your opponent's Characters with a cost of 4 or less.\n• Give up to 1 of your opponent's Characters 1 cost during this turn.",
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
                  value: 1,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02Perona021I18n,
};
