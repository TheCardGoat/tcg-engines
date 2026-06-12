import type { EventCard } from "@tcg/op-types";
import { op05Charlestone038I18n } from "./038-charlestone.i18n.ts";

export const op05Charlestone038: EventCard = {
  id: "OP05-038",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  traits: ["Donquixote Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, you may trash 1 card from your hand. If you do, set up to 3 of your DON!! cards as active. [Trigger] Rest up to 1 of your opponent's Leader or Character cards with a cost of 3 or less.",
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
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
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05Charlestone038I18n,
};
