import type { EventCard } from "@tcg/op-types";
import { op05ElThor114I18n } from "./114-el-thor.i18n.ts";

export const op05ElThor114: EventCard = {
  id: "OP05-114",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  traits: ["Sky Island"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if your opponent has 2 or less Life cards, that card gains an additional +2000 power during this battle. [Trigger] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life Cards.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05ElThor114I18n,
};
