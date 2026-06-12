import type { CharacterCard } from "@tcg/op-types";
import { op07DoguraMagura009I18n } from "./009-dogura-magura.i18n.ts";

export const op07DoguraMagura009: CharacterCard = {
  id: "OP07-009",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Mountain Bandits Mountain Bandits"],
  attribute: "slash",
  effect:
    "[On Play] Up to 1 of your red Characters with a cost of 1 gains [Double Attack] during this turn. (This card deals 2 damage.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "red",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
            keyword: "doubleAttack",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07DoguraMagura009I18n,
};
