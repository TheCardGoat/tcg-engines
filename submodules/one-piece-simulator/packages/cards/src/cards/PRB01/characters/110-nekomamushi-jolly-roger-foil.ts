import type { CharacterCard } from "@tcg/op-types";
import { prb01NekomamushiJollyRogerFoil110I18n } from "./110-nekomamushi-jolly-roger-foil.i18n.ts";

export const prb01NekomamushiJollyRogerFoil110: CharacterCard = {
  id: "OP06-110",
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
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110_p4.jpg",
      imageId: "OP06-110_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-110_r1.png",
      imageId: "OP06-110_r1",
    },
  ],
  effect:
    "[DON!! x2] This Character can also attack your opponent's active Characters.[Trigger] If your opponent has 3 or less Life cards, play this card.",
  effects: {
    effects: [
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
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "canAttackActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb01NekomamushiJollyRogerFoil110I18n,
};
