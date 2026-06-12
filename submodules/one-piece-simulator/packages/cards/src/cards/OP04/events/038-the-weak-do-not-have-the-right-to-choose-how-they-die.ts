import type { EventCard } from "@tcg/op-types";
import { op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038I18n } from "./038-the-weak-do-not-have-the-right-to-choose-how-they-die.i18n.ts";

export const op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038: EventCard = {
  id: "OP04-038",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 5,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] / [Counter] Rest up to 1 of your opponent's Leader or Character cards. Then, K.O. up to 1 of your opponent's rested Characters with a cost of 6 or less. [Trigger] Set up to 5 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            },
          },
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
                  value: 6,
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
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
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
                  value: 6,
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
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 5,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038I18n,
};
