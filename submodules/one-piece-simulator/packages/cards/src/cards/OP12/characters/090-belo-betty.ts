import type { CharacterCard } from "@tcg/op-types";
import { op12BeloBetty090I18n } from "./090-belo-betty.i18n.ts";

export const op12BeloBetty090: CharacterCard = {
  id: "OP12-090",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[When Attacking] You may trash 2 cards from the top of your deck: Give up to 1 of your opponent's Characters 2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12BeloBetty090I18n,
};
