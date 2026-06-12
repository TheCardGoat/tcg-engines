import type { CharacterCard } from "@tcg/op-types";
import { op13Haruta045I18n } from "./045-haruta.i18n.ts";

export const op13Haruta045: CharacterCard = {
  id: "OP13-045",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect: "[When Attacking] If you have 4 or less cards in your hand, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op13Haruta045I18n,
};
