import type { CharacterCard } from "@tcg/op-types";
import { op02MaskedDeuce017I18n } from "./017-masked-deuce.i18n.ts";

export const op02MaskedDeuce017: CharacterCard = {
  id: "OP02-017",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Spade Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-017_p1.jpg",
      imageId: "OP02-017_p1",
    },
  ],
  effect:
    "[DON!! x2] [When Attacking] K.O. up to 1 of your opponent's Characters with 2000 power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
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
                  filter: "power",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02MaskedDeuce017I18n,
};
