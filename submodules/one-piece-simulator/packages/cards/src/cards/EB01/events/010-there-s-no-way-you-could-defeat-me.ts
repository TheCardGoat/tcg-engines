import type { EventCard } from "@tcg/op-types";
import { eb01ThereSNoWayYouCouldDefeatMe010I18n } from "./010-there-s-no-way-you-could-defeat-me.i18n.ts";

export const eb01ThereSNoWayYouCouldDefeatMe010: EventCard = {
  id: "EB01-010",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "EB01",
  cost: 3,
  traits: ["Straw Hat Crew Water Seven"],
  effect:
    "[Counter] K.O. up to 1 of your opponent's Characters with 6000 base power or less. [Trigger] K.O. up to 1 of your opponent's Characters with 5000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 6000,
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
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01ThereSNoWayYouCouldDefeatMe010I18n,
};
