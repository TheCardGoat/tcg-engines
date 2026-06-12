import type { CharacterCard } from "@tcg/op-types";
import { op04Sabo083I18n } from "./083-sabo.i18n.ts";

export const op04Sabo083: CharacterCard = {
  id: "OP04-083",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-083_p1.jpg",
      imageId: "OP04-083_p1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-083_p2.jpg",
      imageId: "OP04-083_p2",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] None of your Characters can be K.O.'d by effects until the start of your next turn. Then, draw 2 cards and trash 2 cards from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            duration: "untilStartOfNextTurn",
            restriction: "byEffect",
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
  i18n: op04Sabo083I18n,
};
