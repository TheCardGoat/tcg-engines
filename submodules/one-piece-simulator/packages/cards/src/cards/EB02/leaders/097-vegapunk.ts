import type { LeaderCard } from "@tcg/op-types";
import { eb02Vegapunk097I18n } from "./097-vegapunk.i18n.ts";

export const eb02Vegapunk097: LeaderCard = {
  id: "OP07-097",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 2,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    'This Leader cannot attack.\n[Activate: Main] [Once Per Turn] 1 (You may rest the specified number of DON!! cards in your cost area.): Select up to 1 "Egghead" type card with a cost of 5 or less from your hand and play it or add it to the top of your Life cards face-up.',
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
  i18n: eb02Vegapunk097I18n,
};
