import type { CharacterCard } from "@tcg/op-types";
import { op03Kalifa081I18n } from "./081-kalifa.i18n.ts";

export const op03Kalifa081: CharacterCard = {
  id: "OP03-081",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP03",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["CP9"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-081_p1.jpg",
      imageId: "OP03-081_p1",
    },
  ],
  effect:
    "[On Play] Draw 2 cards and trash 2 cards from your hand. Then, give up to 1 of your opponent's Characters -2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
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
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op03Kalifa081I18n,
};
