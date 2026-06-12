import type { EventCard } from "@tcg/op-types";
import { op06GravityBladeRagingTiger058I18n } from "./058-gravity-blade-raging-tiger.i18n.ts";

export const op06GravityBladeRagingTiger058: EventCard = {
  id: "OP06-058",
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP06",
  cost: 7,
  trigger: "Place up to 1 Character with a cost of 5 or less at the bottom of the owner's deck.",
  traits: ["Navy"],
  effect:
    "[Main] Place up to 2 Characters with a cost of 6 or less at the bottom of the owner's deck in any order.",
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
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06GravityBladeRagingTiger058I18n,
};
