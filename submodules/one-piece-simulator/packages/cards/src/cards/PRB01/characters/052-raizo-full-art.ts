import type { CharacterCard } from "@tcg/op-types";
import { prb01RaizoFullArt052I18n } from "./052-raizo-full-art.i18n.ts";

export const prb01RaizoFullArt052: CharacterCard = {
  id: "OP01-052",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "PRB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-052_p3.jpg",
      imageId: "OP01-052_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-052_r1.jpg",
      imageId: "OP01-052_r1",
    },
  ],
  effect: "[When Attacking] [Once Per Turn] If you have 2 or more rested Characters, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb01RaizoFullArt052I18n,
};
