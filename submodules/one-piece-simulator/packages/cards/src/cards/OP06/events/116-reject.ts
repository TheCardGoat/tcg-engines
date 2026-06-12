import type { EventCard } from "@tcg/op-types";
import { op06Reject116I18n } from "./116-reject.i18n.ts";

export const op06Reject116: EventCard = {
  id: "OP06-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  trigger: "Draw 1 cards.",
  traits: ["Sky Island Shandian Warrior"],
  effect:
    "[Main] Choose one:\n• K.O. up to 1 of your opponent's Characters with a cost of 5 or less.\n• If your opponent has 1 Life card, deal 1 damage to your opponent.\nThen, add 1 card from the top of your Life cards to your hand.",
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
  i18n: op06Reject116I18n,
};
