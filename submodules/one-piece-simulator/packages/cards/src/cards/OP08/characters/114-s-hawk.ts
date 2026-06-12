import type { CharacterCard } from "@tcg/op-types";
import { op08SHawk114I18n } from "./114-s-hawk.i18n.ts";

export const op08SHawk114: CharacterCard = {
  id: "OP08-114",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Egghead Seraphim"],
  attribute: "slash",
  effect:
    "[DON!! x1] If you have less Life cards than your opponent, this Character cannot be K.O.'d in battle by attribute cards and gains +2000 power. [Trigger] You may trash 1 card from your hand: If you have 2 or less Life cards, play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "lifeComparison",
            selfComparison: "lt",
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
          },
        ],
      },
    ],
  },
  i18n: op08SHawk114I18n,
};
