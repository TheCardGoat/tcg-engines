import type { EventCard } from "@tcg/op-types";
import { op03OneTwoJango039I18n } from "./039-one-two-jango.i18n.ts";

export const op03OneTwoJango039: EventCard = {
  id: "OP03-039",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP03",
  cost: 1,
  traits: ["East Blue Black Cat Pirates"],
  effect:
    "[Main] Rest up to 1 of your opponent's Characters with a cost of 1 or less. Then, up to 1 of your Characters gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
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
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op03OneTwoJango039I18n,
};
