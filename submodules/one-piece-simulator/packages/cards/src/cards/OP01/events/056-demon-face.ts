import type { EventCard } from "@tcg/op-types";
import { op01DemonFace056I18n } from "./056-demon-face.i18n.ts";

export const op01DemonFace056: EventCard = {
  id: "OP01-056",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP01",
  cost: 6,
  traits: ["Hawkins Pirates Supernovas"],
  effect:
    "[Main] K.O. up to 2 of your opponent's rested Characters with a cost of 5 or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01DemonFace056I18n,
};
