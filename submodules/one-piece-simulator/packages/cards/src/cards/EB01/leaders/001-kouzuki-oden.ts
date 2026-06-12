import type { LeaderCard } from "@tcg/op-types";
import { eb01KouzukiOden001I18n } from "./001-kouzuki-oden.i18n.ts";

export const eb01KouzukiOden001: LeaderCard = {
  id: "EB01-001",
  cardType: "leader",
  color: ["green", "red"],
  rarity: "L",
  setId: "EB01",
  power: 5000,
  life: 4,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-001_p1.jpg",
      imageId: "EB01-001_p1",
    },
  ],
  effect:
    "All of your [Land of Wano] type Character cards without a Counter have a +1000 Counter, according to the rules.[DON!! x1] [When Attacking] If you have a [Land of Wano] type Character with a cost of 5 or more, this Leader gains +1000 power until the start of your next turn.",
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
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "Land of Wano",
              },
              {
                filter: "cost",
                comparison: "gte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "untilStartOfNextTurn",
          },
        ],
      },
    ],
  },
  i18n: eb01KouzukiOden001I18n,
};
