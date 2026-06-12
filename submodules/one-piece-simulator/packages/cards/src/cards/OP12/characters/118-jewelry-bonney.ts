import type { CharacterCard } from "@tcg/op-types";
import { op12JewelryBonney118I18n } from "./118-jewelry-bonney.i18n.ts";

export const op12JewelryBonney118: CharacterCard = {
  id: "OP12-118",
  cardType: "character",
  color: ["green"],
  rarity: "SEC",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-118_p2_Xxs1TDY.jpg",
      imageId: "OP12-118_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-118_p1_2XxNAy0.jpg",
      imageId: "OP12-118_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Play] If you have 8 or more rested cards, draw 2 cards and trash 1 card from your hand. Then, set up to 1 of your DON!! cards as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op12JewelryBonney118I18n,
};
