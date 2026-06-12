import type { EventCard } from "@tcg/op-types";
import { op09SpecialMuggyBall058I18n } from "./058-special-muggy-ball.i18n.ts";

export const op09SpecialMuggyBall058: EventCard = {
  id: "OP09-058",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  traits: ["Buggy Pirates"],
  effect:
    "[Main] Your opponent chooses 1 of their Character with a cost of 6 or less and return to the owner's hand. [Trigger] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
              },
              chosenBy: "opponent",
              filters: [
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
            action: "returnToHand",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09SpecialMuggyBall058I18n,
};
