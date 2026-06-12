import type { LeaderCard } from "@tcg/op-types";
import { op03Arlong022I18n } from "./022-arlong.i18n.ts";

export const op03Arlong022: LeaderCard = {
  id: "OP03-022",
  cardType: "leader",
  color: ["green", "yellow"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 4,
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-022_p1.jpg",
      imageId: "OP03-022_p1",
    },
  ],
  effect:
    "[DON!! x2] [When Attacking (1) (You may rest the specified number of DON!! cards in your cost area.): Play up to 1 Character card with a cost of 4 or less and a [Trigger] from your hand.",
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
            cost: "restDon",
            amount: 1,
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
              upTo: true,
            },
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op03Arlong022I18n,
};
