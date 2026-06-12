import type { EventCard } from "@tcg/op-types";
import { op02GumGumRain068I18n } from "./068-gum-gum-rain.i18n.ts";

export const op02GumGumRain068: EventCard = {
  id: "OP02-068",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP02",
  cost: 0,
  traits: ["Straw Hat Crew Impel Down"],
  effect:
    "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Character cards gains +3000 power during this battle. [Trigger] Return up to 1 Character with a cost of 2 or less to the owner's hand.",
  effects: {
    effects: [
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
        optional: true,
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
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02GumGumRain068I18n,
};
