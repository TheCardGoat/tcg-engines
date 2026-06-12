import type { CharacterCard } from "@tcg/op-types";
import { op07Edison100I18n } from "./100-edison.i18n.ts";

export const op07Edison100: CharacterCard = {
  id: "OP07-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    "[On Play] If you have 2 or less Life cards, draw 2 cards and trash 2 card from your hand. [Trigger] If your Leader is [Vegapunk], play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Vegapunk",
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
      },
    ],
  },
  i18n: op07Edison100I18n,
};
