import type { CharacterCard } from "@tcg/op-types";
import { op07Pythagoras105I18n } from "./105-pythagoras.i18n.ts";

export const op07Pythagoras105: CharacterCard = {
  id: "OP07-105",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    "[On K.O.] If you have 2 or less Life cards, play up to 1 {Egghead} type Character card with a cost of 4 or less from your trash rested. [Trigger] If your Leader is [Vegapunk], play this card.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Egghead",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
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
  i18n: op07Pythagoras105I18n,
};
