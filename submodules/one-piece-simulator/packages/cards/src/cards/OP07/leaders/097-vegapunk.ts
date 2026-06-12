import type { LeaderCard } from "@tcg/op-types";
import { op07Vegapunk097I18n } from "./097-vegapunk.i18n.ts";

export const op07Vegapunk097: LeaderCard = {
  id: "OP07-097",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "OP07",
  power: 5000,
  life: 2,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-097_p1.jpg",
      imageId: "OP07-097_p1",
    },
  ],
  effect:
    "This Leader cannot attack. [Activate: Main][Once Per Turn] (1) (You may rest the specified number of DON!! cards in your cost area.): Select up to 1 [Egghead] type card with a cost of 5 or less from your hand and play it or add it to the top of your Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "play",
                  source: {
                    player: "self",
                    zone: "hand",
                  },
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
              ],
              [
                {
                  action: "addToLife",
                  target: {
                    player: "self",
                    zones: ["hand"],
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
                  position: "top",
                  faceUp: true,
                },
              ],
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op07Vegapunk097I18n,
};
