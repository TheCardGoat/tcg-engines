import type { EventCard } from "@tcg/op-types";
import { op03DeathlyPoisonGasBombMh5038I18n } from "./038-deathly-poison-gas-bomb-mh5.i18n.ts";

export const op03DeathlyPoisonGasBombMh5038: EventCard = {
  id: "OP03-038",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP03",
  cost: 1,
  traits: ["NULL"],
  effect:
    "[Main] Rest up to 2 of your opponent's Characters with a cost of 2 or less. [Trigger] Rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
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
      },
      {
        trigger: "trigger",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03DeathlyPoisonGasBombMh5038I18n,
};
