import type { LeaderCard } from "@tcg/op-types";
import { op03Kuro021I18n } from "./021-kuro.i18n.ts";

export const op03Kuro021: LeaderCard = {
  id: "OP03-021",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP03",
  power: 5000,
  life: 5,
  traits: ["East Blue Black Cat Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-021_p1.jpg",
      imageId: "OP03-021_p1",
    },
  ],
  effect:
    "[Activate:Main] (3) (You may rest the specified number of DON!! cards in your cost area.) You may rest 2 of your [East Blue] type Characters: Set this Leader as active, and rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
          {
            cost: "restCards",
            amount: 2,
            filters: [
              {
                filter: "trait",
                value: "East Blue",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
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
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03Kuro021I18n,
};
