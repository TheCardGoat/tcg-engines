import type { CharacterCard } from "@tcg/op-types";
import { op05Mansherry088I18n } from "./088-mansherry.i18n.ts";

export const op05Mansherry088: CharacterCard = {
  id: "OP05-088",
  canonicalId: "OP05-088",
  slug: "mansherry/op05-088",
  name: "Mansherry",
  printings: [
    {
      id: "OP05-088",
      artId: "OP05-088",
      setCode: "OP05",
      collectorNumber: "088",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-088.jpg",
    },
    {
      id: "OP05-088_p1",
      artId: "OP05-088_p1",
      setCode: "OP05",
      collectorNumber: "088",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-088_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["The Tontattas", "Dressrosa"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-088_p1.jpg",
      imageId: "OP05-088_p1",
    },
  ],
  effect:
    "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may rest this Character and place 2 cards from your trash at the bottom of your deck in any order: Add up to 1 black Character card with a cost of 3 to 5 from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "restThisCard",
          },
          {
            cost: "returnTrashToDeck",
            amount: 2,
            position: "bottom",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "black",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 3,
                },
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
  i18n: op05Mansherry088I18n,
};
