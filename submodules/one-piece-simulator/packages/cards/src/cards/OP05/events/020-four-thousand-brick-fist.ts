import type { EventCard } from "@tcg/op-types";
import { op05FourThousandBrickFist020I18n } from "./020-four-thousand-brick-fist.i18n.ts";

export const op05FourThousandBrickFist020: EventCard = {
  id: "OP05-020",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP05",
  cost: 2,
  traits: ["Fish-Man Revolutionary Army"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +2000 power during this turn. Then, K.O. up to 1 of your opponent's Characters with 2000 power or less. [Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
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
                  filter: "power",
                  comparison: "lte",
                  value: 2000,
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op05FourThousandBrickFist020I18n,
};
