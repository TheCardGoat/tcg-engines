import type { EventCard } from "@tcg/op-types";
import { op08ElectricalLuna036I18n } from "./036-electrical-luna.i18n.ts";

export const op08ElectricalLuna036: EventCard = {
  id: "OP08-036",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP08",
  cost: 3,
  traits: ["Minks"],
  effect:
    "[Main] All of your opponent's rested Characters with a cost of 7 or less will not become active in your opponent's next Refresh Phase. [Trigger] Rest up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op08ElectricalLuna036I18n,
};
