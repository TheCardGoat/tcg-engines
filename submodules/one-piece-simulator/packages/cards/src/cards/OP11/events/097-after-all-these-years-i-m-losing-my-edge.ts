import type { EventCard } from "@tcg/op-types";
import { op11AfterAllTheseYearsIMLosingMyEdge097I18n } from "./097-after-all-these-years-i-m-losing-my-edge.i18n.ts";

export const op11AfterAllTheseYearsIMLosingMyEdge097: EventCard = {
  id: "OP11-097",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +1000 power during this battle. Then, if you have 10 or more cards in your trash, add up to 1 black Character card with a cost of 3 or less from your trash to your hand.",
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
            value: 1000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op11AfterAllTheseYearsIMLosingMyEdge097I18n,
};
