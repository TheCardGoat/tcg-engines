import type { CharacterCard } from "@tcg/op-types";
import { op08Robson013I18n } from "./013-robson.i18n.ts";

export const op08Robson013: CharacterCard = {
  id: "OP08-013",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP08",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Drum Kingdom"],
  attribute: "wisdom",
  effect:
    "[DON!! x2] This Character gains [Rush]. (This card can attack on the turn in which it is played.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
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
  i18n: op08Robson013I18n,
};
