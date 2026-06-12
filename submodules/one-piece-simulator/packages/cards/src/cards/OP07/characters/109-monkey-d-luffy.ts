import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDLuffy109I18n } from "./109-monkey-d-luffy.i18n.ts";

export const op07MonkeyDLuffy109: CharacterCard = {
  id: "OP07-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew The Four Emperors Egghead"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-109_p1.jpg",
      imageId: "OP07-109_p1",
    },
  ],
  effect:
    "[Activate: Main]You may trash this Character: If you have 2 or less Life cards, K.O. up to 1 of your opponent's Characters with a cost of 4 or less. Then, draw 1 card. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        costs: [
          {
            cost: "trashThisCard",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07MonkeyDLuffy109I18n,
};
