import type { EventCard } from "@tcg/op-types";
import { op03ToothAttack037I18n } from "./037-tooth-attack.i18n.ts";

export const op03ToothAttack037: EventCard = {
  id: "OP03-037",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  traits: ["Fish-Man Arlong Pirates East Blue"],
  effect:
    "[Main] You may rest 1 of your [East Blue] type Characters: K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less. [Trigger] Play up to 1 Character card with a cost of 4 or less and a [Trigger] from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "East Blue",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
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
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op03ToothAttack037I18n,
};
