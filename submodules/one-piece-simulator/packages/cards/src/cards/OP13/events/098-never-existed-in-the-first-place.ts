import type { EventCard } from "@tcg/op-types";
import { op13NeverExistedInTheFirstPlace098I18n } from "./098-never-existed-in-the-first-place.i18n.ts";

export const op13NeverExistedInTheFirstPlace098: EventCard = {
  id: "OP13-098",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP13",
  cost: 1,
  traits: ["Celestial Dragons Five Elders"],
  effect:
    "[Main] You may rest 1 of your DON!! cards: If your Leader is [Imu], K.O. up to 1 of your opponent's Stages with a cost of 7.\n[Counter] If your Leader is [Imu], up to 1 of your Leader or Character cards gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderName",
            name: "Imu",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["stage"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 7,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderName",
            name: "Imu",
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op13NeverExistedInTheFirstPlace098I18n,
};
