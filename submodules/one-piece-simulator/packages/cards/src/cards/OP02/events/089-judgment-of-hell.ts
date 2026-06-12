import type { EventCard } from "@tcg/op-types";
import { op02JudgmentOfHell089I18n } from "./089-judgment-of-hell.i18n.ts";

export const op02JudgmentOfHell089: EventCard = {
  id: "OP02-089",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP02",
  cost: 2,
  traits: ["Impel Down"],
  effect:
    "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to a total of 2 of your opponent's Leader or Character cards -3000 power during this turn. [Trigger] If your opponent has 6 or more DON!! cards on their field, your opponent returns 1 DON!! card from their field to their DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "donFieldCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "opponentReturnDon",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op02JudgmentOfHell089I18n,
};
