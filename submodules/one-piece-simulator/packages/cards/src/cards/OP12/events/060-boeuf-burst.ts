import type { EventCard } from "@tcg/op-types";
import { op12BoeufBurst060I18n } from "./060-boeuf-burst.i18n.ts";

export const op12BoeufBurst060: EventCard = {
  id: "OP12-060",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP12",
  cost: 3,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-060_p1_5Y8uKIK.jpg",
      imageId: "OP12-060_p1",
    },
  ],
  effect:
    "[Main] If your Leader is multicolored, choose one:\n• Return up to 1 of your opponent's Characters with a cost of 4 or less to the owner's hand.\n• If you have 6 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
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
                        value: 4,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "draw",
                  player: "self",
                  amount: 2,
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op12BoeufBurst060I18n,
};
