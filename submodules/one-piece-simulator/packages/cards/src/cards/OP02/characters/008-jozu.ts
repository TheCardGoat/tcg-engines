import type { CharacterCard } from "@tcg/op-types";
import { op02Jozu008I18n } from "./008-jozu.i18n.ts";

export const op02Jozu008: CharacterCard = {
  id: "OP02-008",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[DON!! x1] If you have 2 or less Life cards and your Leader\'s type includes "Whitebeard Pirates", this Character gains [Rush]. (This card can attack on the turn in which it is played.)',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "lifeCount",
                player: "self",
                comparison: "lte",
                value: 2,
              },
              {
                condition: "leaderTrait",
                trait: "Whitebeard Pirates",
              },
            ],
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
  i18n: op02Jozu008I18n,
};
