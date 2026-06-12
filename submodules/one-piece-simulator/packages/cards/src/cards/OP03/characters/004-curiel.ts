import type { CharacterCard } from "@tcg/op-types";
import { op03Curiel004I18n } from "./004-curiel.i18n.ts";

export const op03Curiel004: CharacterCard = {
  id: "OP03-004",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "ranged",
  effect:
    "This Character cannot attack a Leader on the turn in which it is played. [DON!! x1] This Character gains [Rush]. (This card can attack on the turn in which it is played.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
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
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op03Curiel004I18n,
};
