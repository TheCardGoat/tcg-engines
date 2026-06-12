import type { EventCard } from "@tcg/op-types";
import { op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040I18n } from "./040-the-weak-do-not-have-the-right-to-choose-how-they-die.i18n.ts";

export const op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040: EventCard = {
  id: "OP10-040",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP10",
  cost: 5,
  traits: ["Heart Pirates The Seven Warlords of the Sea Punk Hazard"],
  effect:
    "[Main]/[Counter] K.O. up to 1 of your opponent's rested Characters with a cost of 7 or less.",
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
                  value: 7,
                },
              ],
            },
          },
        ],
      },
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
    ],
  },
  i18n: op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040I18n,
};
