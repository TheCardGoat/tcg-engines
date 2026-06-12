import type { CharacterCard } from "@tcg/op-types";
import { op03Sogeking122I18n } from "./122-sogeking.i18n.ts";

export const op03Sogeking122: CharacterCard = {
  id: "OP03-122",
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "OP03",
  cost: 7,
  power: 6000,
  counter: 1000,
  traits: ["Sniper Island"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-122_p1.jpg",
      imageId: "OP03-122_p1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-122_p2.jpg",
      imageId: "OP03-122_p2",
    },
  ],
  effect:
    "Also treat this card's name as [Usopp] according to the rules. [On Play] Return up to 1 Character with a cost of 6 or less to the owner's hand. Then, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
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
                  value: 6,
                },
              ],
            },
          },
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op03Sogeking122I18n,
};
