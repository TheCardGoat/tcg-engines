import type { CharacterCard } from "@tcg/op-types";
import { op08King060I18n } from "./060-king.i18n.ts";

export const op08King060: CharacterCard = {
  id: "OP08-060",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP08",
  cost: 7,
  power: 8000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  effect:
    "[On Play] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your opponent has 5 or more DON!! cards on their field, this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "opponent",
            comparison: "gte",
            value: 5,
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op08King060I18n,
};
