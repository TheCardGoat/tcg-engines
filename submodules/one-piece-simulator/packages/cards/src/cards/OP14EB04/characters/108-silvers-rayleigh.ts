import type { CharacterCard } from "@tcg/op-types";
import { op14eb04SilversRayleigh108I18n } from "./108-silvers-rayleigh.i18n.ts";

export const op14eb04SilversRayleigh108: CharacterCard = {
  id: "OP14-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 6,
  power: 6000,
  counter: 1000,
  trigger: "Activate this card's [On Play] effect.",
  traits: ["Former Roger Pirates"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader is multicolored and your opponent has 3 or less Life cards, K.O. up to 1 of your opponent's Characters with 7000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderMulticolored",
              },
              {
                condition: "lifeCount",
                player: "opponent",
                comparison: "lte",
                value: 3,
              },
            ],
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 7000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04SilversRayleigh108I18n,
};
