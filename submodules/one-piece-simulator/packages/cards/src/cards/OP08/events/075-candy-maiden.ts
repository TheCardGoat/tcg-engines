import type { EventCard } from "@tcg/op-types";
import { op08CandyMaiden075I18n } from "./075-candy-maiden.i18n.ts";

export const op08CandyMaiden075: EventCard = {
  id: "OP08-075",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  traits: ["Big Mom Pirates"],
  effect:
    "[Main] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 2 or less. Then, turn all of your Life cards face-down.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
                  value: 2,
                },
              ],
            },
          },
          {
            action: "turnLifeFaceDown",
            player: "self",
          },
        ],
      },
    ],
  },
  i18n: op08CandyMaiden075I18n,
};
