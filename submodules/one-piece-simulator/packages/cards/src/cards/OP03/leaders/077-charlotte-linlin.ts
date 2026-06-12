import type { LeaderCard } from "@tcg/op-types";
import { op03CharlotteLinlin077I18n } from "./077-charlotte-linlin.i18n.ts";

export const op03CharlotteLinlin077: LeaderCard = {
  id: "OP03-077",
  cardType: "leader",
  color: ["yellow", "black"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 4,
  traits: ["The Four Emperors Big Mom Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-077_p1.jpg",
      imageId: "OP03-077_p1",
    },
  ],
  effect:
    "[DON!! x2] [When Attacking] (2) (You may rest the specified number of DON!! cards in your cost area.) You may trash 1 card from your hand: If you have 1 or less Life cards, add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03CharlotteLinlin077I18n,
};
