import type { EventCard } from "@tcg/op-types";
import { op12Concasser059I18n } from "./059-concasser.i18n.ts";

export const op12Concasser059: EventCard = {
  id: "OP12-059",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP12",
  cost: 1,
  traits: ["Straw Hat Crew Sky Island"],
  effect:
    "[Main] If your Leader is [Sanji], draw 1 card.\n[Counter] If you have 4 or more Events in your trash, up to 1 of your Leader gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Sanji",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "counter",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 4,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
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
    ],
  },
  i18n: op12Concasser059I18n,
};
