import type { EventCard } from "@tcg/op-types";
import { eb02ThreePaceHumSoulNotchSlash051I18n } from "./051-three-pace-hum-soul-notch-slash.i18n.ts";

export const eb02ThreePaceHumSoulNotchSlash051: EventCard = {
  id: "EB02-051",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  traits: ["Former Rumbar Pirates"],
  effect:
    "[Main] Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 2 or less.\n• Give up to 1 of your opponent's Characters 4 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        value: 2,
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
                  value: 4,
                  duration: "thisTurn",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02ThreePaceHumSoulNotchSlash051I18n,
};
