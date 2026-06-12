import type { EventCard } from "@tcg/op-types";
import { op05IBid500Million096I18n } from "./096-i-bid-500-million.i18n.ts";

export const op05IBid500Million096: EventCard = {
  id: "OP05-096",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  effect:
    "[Main] Choose one: • K.O. up to 1 of your opponent's Characters with a cost of 1 or less. • Return up to 1 of your opponent's Characters with a cost of 1 or less to the owner's hand. • Place up to 1 of your opponent's Characters with a cost of 1 or less at the top or bottom of their Life cards face-up. Then, if you have a [Celestial Dragons] type Character, draw 1 card. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 6 or less, or return it to the owner's hand.",
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
                        value: 1,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "returnToHand",
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
                        value: 1,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
      {
        trigger: "trigger",
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
                        value: 6,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "returnToHand",
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
            ],
          },
        ],
      },
    ],
  },
  i18n: op05IBid500Million096I18n,
};
