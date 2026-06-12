import type { LeaderCard } from "@tcg/op-types";
import { op08Carrot021I18n } from "./021-carrot.i18n.ts";

export const op08Carrot021: LeaderCard = {
  id: "OP08-021",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP08",
  power: 5000,
  life: 5,
  traits: ["Minks"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-021_p1.jpg",
      imageId: "OP08-021_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] If you have a [Minks] type Character, rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "Minks",
              },
            ],
          },
        ],
        actions: [
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08Carrot021I18n,
};
