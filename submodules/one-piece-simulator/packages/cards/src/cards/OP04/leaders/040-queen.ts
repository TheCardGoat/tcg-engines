import type { LeaderCard } from "@tcg/op-types";
import { op04Queen040I18n } from "./040-queen.i18n.ts";

export const op04Queen040: LeaderCard = {
  id: "OP04-040",
  cardType: "leader",
  color: ["blue", "yellow"],
  rarity: "L",
  setId: "OP04",
  power: 5000,
  life: 4,
  traits: ["Animal Kingdom Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-040_p1.jpg",
      imageId: "OP04-040_p1",
    },
  ],
  effect:
    "[DON!! x1] [When Attacking] If you have a total of 4 or less cards in your Life area and hand, draw 1 card. If you have a Character with a cost of 8 or more, you may add up to 1 card from the top of your deck to the top of your Life cards instead of drawing 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
                value: 4,
              },
              {
                condition: "handCount",
                player: "self",
                comparison: "lte",
                value: 4,
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
      },
    ],
  },
  i18n: op04Queen040I18n,
};
