import type { EventCard } from "@tcg/op-types";
import { st11Backlight003I18n } from "./st11-003-backlight.i18n.ts";
export const st11Backlight003: EventCard = {
  id: "ST11-003",
  canonicalId: "ST11-003",
  slug: "backlight/st11-003",
  name: "Backlight",
  printings: [
    {
      id: "ST11-003",
      artId: "ST11-003",
      setCode: "ST11",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST11-003.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "ST11",
  traits: ["Music", "FILM"],
  cost: 2,
  effect:
    "[Main] If your Leader is [Uta], choose one: • Rest up to 1 of your opponent's Characters with a cost of 5 or less. • K.O. up to 1 of your opponent's rested Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Uta",
          },
        ],
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
                        value: 5,
                      },
                    ],
                  },
                },
              ],
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
                        filter: "state",
                        value: "rested",
                      },
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 5,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: st11Backlight003I18n,
};
