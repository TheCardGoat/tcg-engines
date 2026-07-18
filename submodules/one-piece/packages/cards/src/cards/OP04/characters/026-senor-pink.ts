import type { CharacterCard } from "@tcg/op-types";
import { op04SenorPink026I18n } from "./026-senor-pink.i18n.ts";

export const op04SenorPink026: CharacterCard = {
  id: "OP04-026",
  canonicalId: "OP04-026",
  slug: "senor-pink/op04-026",
  name: "Senor Pink",
  printings: [
    {
      id: "OP04-026",
      artId: "OP04-026",
      setCode: "OP04",
      collectorNumber: "026",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-026.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP04",
  cost: 3,
  power: 5000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[When Attacking] (1) (You may rest the specified number of DON!! cards in your cost area.): If your Leader has the [Donquixote Pirates] type, rest up to 1 of your opponent's Characters with a cost of 4 or less. Then, set up to 1 of your DON!! cards as active at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
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
              ],
            },
            condition: {
              condition: "leaderTrait",
              trait: "Donquixote Pirates",
              match: "includes",
            },
          },
          {
            action: "delayed",
            timing: "endOfThisTurn",
            actions: [
              {
                action: "setActive",
                target: {
                  player: "self",
                  zones: ["costArea"],
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                },
              },
            ],
            condition: {
              condition: "leaderTrait",
              trait: "Donquixote Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04SenorPink026I18n,
};
