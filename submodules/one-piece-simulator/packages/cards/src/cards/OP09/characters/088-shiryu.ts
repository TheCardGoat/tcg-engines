import type { CharacterCard } from "@tcg/op-types";
import { op09Shiryu088I18n } from "./088-shiryu.i18n.ts";

export const op09Shiryu088: CharacterCard = {
  id: "OP09-088",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Blackbeard Pirates"],
  attribute: "slash",
  effect: "[DON!! x1] [When Attacking] You may trash 2 cards from your hand: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Shiryu088I18n,
};
