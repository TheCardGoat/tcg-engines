import type { LeaderCard } from "@tcg/op-types";
import { eb02King057I18n } from "./057-king.i18n.ts";

export const eb02King057: LeaderCard = {
  id: "OP08-057",
  cardType: "leader",
  color: ["purple", "black"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] DON!! 2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Choose one:\n• If you have 5 or less cards in your hand, draw 1 card.\n• Give up to 1 of your opponent's Characters 2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "draw",
                  player: "self",
                  amount: 1,
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
                  value: 2,
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
  i18n: eb02King057I18n,
};
