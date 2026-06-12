import type { CharacterCard } from "@tcg/op-types";
import { op04Pell013I18n } from "./013-pell.i18n.ts";

export const op04Pell013: CharacterCard = {
  id: "OP04-013",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP04",
  cost: 5,
  power: 6000,
  traits: ["Alabasta"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-013_p1.jpg",
      imageId: "OP04-013_p1",
    },
  ],
  effect:
    "[DON!! x1] [When Attacking] K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
                  value: 4000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Pell013I18n,
};
