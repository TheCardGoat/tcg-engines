import type { EventCard } from "@tcg/op-types";
import { op02ThreeSwordStyleOniGiri045I18n } from "./045-three-sword-style-oni-giri.i18n.ts";

export const op02ThreeSwordStyleOniGiri045: EventCard = {
  id: "OP02-045",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 3,
  traits: ["Film Straw Hat Crew Supernovas"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +6000 power during this battle. Then, play up to 1 Character card with a cost of 3 or less and no base effect from your hand. [Trigger] Rest up to 1 of your opponent's Leader or Character cards with a cost of 5 or less.",
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
            value: 6000,
            duration: "thisBattle",
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "hasEffectType",
                value: "onPlay",
                negate: true,
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
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
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
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
  i18n: op02ThreeSwordStyleOniGiri045I18n,
};
