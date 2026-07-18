import type { EventCard } from "@tcg/op-types";
import { op05Charlestone038I18n } from "./038-charlestone.i18n.ts";

export const op05Charlestone038: EventCard = {
  id: "OP05-038",
  canonicalId: "OP05-038",
  slug: "charlestone",
  name: "Charlestone",
  printings: [
    {
      id: "OP05-038",
      artId: "OP05-038",
      setCode: "OP05",
      collectorNumber: "038",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-038.jpg",
    },
  ],
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
        ],
      },
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 3,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
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
