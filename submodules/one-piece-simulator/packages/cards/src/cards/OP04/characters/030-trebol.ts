import type { CharacterCard } from "@tcg/op-types";
import { op04Trebol030I18n } from "./030-trebol.i18n.ts";

export const op04Trebol030: CharacterCard = {
  id: "OP04-030",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP04",
  cost: 6,
  power: 6000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-030_p1.jpg",
      imageId: "OP04-030_p1",
    },
  ],
  effect:
    "[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 5 or less. [On Your Opponent's Attack] (2) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 2,
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
          },
        ],
      },
    ],
  },
  i18n: op04Trebol030I18n,
};
