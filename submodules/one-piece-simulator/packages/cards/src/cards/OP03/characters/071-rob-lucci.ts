import type { CharacterCard } from "@tcg/op-types";
import { op03RobLucci071I18n } from "./071-rob-lucci.i18n.ts";

export const op03RobLucci071: CharacterCard = {
  id: "OP03-071",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "strike",
  effect:
    "[When Attacking] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03RobLucci071I18n,
};
