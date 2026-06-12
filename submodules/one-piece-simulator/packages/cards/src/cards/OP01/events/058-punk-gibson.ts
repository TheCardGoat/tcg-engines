import type { EventCard } from "@tcg/op-types";
import { op01PunkGibson058I18n } from "./058-punk-gibson.i18n.ts";

export const op01PunkGibson058: EventCard = {
  id: "OP01-058",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP01",
  cost: 2,
  traits: ["Kid Pirates Supernovas"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, rest up to 1 of your opponent's Characters with a cost of 4 or less. [Trigger] Rest up to 1 of your opponent's Characters.  This card has been officially errata'd.",
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
            action: "rest",
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
                  value: 4,
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
  i18n: op01PunkGibson058I18n,
};
