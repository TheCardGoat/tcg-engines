import type { EventCard } from "@tcg/op-types";
import { op06YouAinTEvenWorthKillingTime039I18n } from "./039-you-ain-t-even-worth-killing-time.i18n.ts";

export const op06YouAinTEvenWorthKillingTime039: EventCard = {
  id: "OP06-039",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] Choose one:\n• Rest up to 1 of your opponent's Characters with a cost of 6 or less.\n• K.O. up to 1 of your opponent's rested Characters with a cost of 6 or less.",
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
                        value: 6,
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
                        value: 6,
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
  i18n: op06YouAinTEvenWorthKillingTime039I18n,
};
