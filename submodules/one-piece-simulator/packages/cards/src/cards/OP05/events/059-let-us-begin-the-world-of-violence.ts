import type { EventCard } from "@tcg/op-types";
import { op05LetUsBeginTheWorldOfViolence059I18n } from "./059-let-us-begin-the-world-of-violence.i18n.ts";

export const op05LetUsBeginTheWorldOfViolence059: EventCard = {
  id: "OP05-059",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP05",
  cost: 5,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  effect:
    "[Main] If your Leader is multicolored, draw 1 card. Then, return up to 1 Character with a cost of 5 or less to the owner's hand. [Trigger] If your Leader is multicolored, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op05LetUsBeginTheWorldOfViolence059I18n,
};
