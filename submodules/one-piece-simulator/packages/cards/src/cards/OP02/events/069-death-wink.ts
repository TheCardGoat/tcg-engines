import type { EventCard } from "@tcg/op-types";
import { op02DeathWink069I18n } from "./069-death-wink.i18n.ts";

export const op02DeathWink069: EventCard = {
  id: "OP02-069",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 3,
  traits: ["Revolutionary Army Impel Down"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +6000 power during this battle. Then, draw cards so that you have 2 cards in your hand. [Trigger] Return up to 1 Character with a cost of 7 or less to the owner's hand.",
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
            value: 6000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
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
                  value: 7,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02DeathWink069I18n,
};
