import type { CharacterCard } from "@tcg/op-types";
import { prb01InuarashiJollyRogerFoil100I18n } from "./100-inuarashi-jolly-roger-foil.i18n.ts";

export const prb01InuarashiJollyRogerFoil100: CharacterCard = {
  id: "OP06-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Land of Wano Minks The Akazaya Nine"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-100_p3.jpg",
      imageId: "OP06-100_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-100_r1.png",
      imageId: "OP06-100_r1",
    },
  ],
  effect:
    "[DON!! x2][When Attacking] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.[Trigger] If your opponent has 3 or less Life cards, play this card.",
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
        costs: [
          {
            cost: "trashFromHand",
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
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
  i18n: prb01InuarashiJollyRogerFoil100I18n,
};
