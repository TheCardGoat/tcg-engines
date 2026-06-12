import type { CharacterCard } from "@tcg/op-types";
import { op06Shuraiya009I18n } from "./009-shuraiya.i18n.ts";

export const op06Shuraiya009: CharacterCard = {
  id: "OP06-009",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM Shipbuilding Town"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-009_p1.jpg",
      imageId: "OP06-009_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[When Attacking] / [On Block] [Once Per Turn] This Character's base power becomes the same as your opponent's Leader until the start of your next turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "setPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 0,
            duration: "untilStartOfNextTurn",
          },
        ],
        oncePerTurn: true,
      },
      {
        trigger: "onBlock",
        actions: [
          {
            action: "setPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 0,
            duration: "untilStartOfNextTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Shuraiya009I18n,
};
