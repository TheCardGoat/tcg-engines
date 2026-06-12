import type { EventCard } from "@tcg/op-types";
import { op06AmaNoMurakumoSword056I18n } from "./056-ama-no-murakumo-sword.i18n.ts";

export const op06AmaNoMurakumoSword056: EventCard = {
  id: "OP06-056",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP06",
  cost: 2,
  traits: ["Navy"],
  effect:
    "[Main] Place up to 1 of your opponent's Characters with a cost of 2 or less and up to 1 of your opponent's Characters with a cost of 1 or less at the bottom of the owner's deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToDeck",
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
            position: "bottom",
          },
          {
            action: "returnToDeck",
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
                  value: 1,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06AmaNoMurakumoSword056I18n,
};
