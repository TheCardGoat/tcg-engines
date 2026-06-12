import type { CharacterCard } from "@tcg/op-types";
import { op03Issho078I18n } from "./078-issho.i18n.ts";

export const op03Issho078: CharacterCard = {
  id: "OP03-078",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP03",
  cost: 8,
  power: 9000,
  traits: ["Navy"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-078_p1.jpg",
      imageId: "OP03-078_p1",
    },
  ],
  effect:
    "[DON!! x1] [Your Turn] Give all of your opponent's Characters -3 cost. [On Play] If your opponent has 6 or more cards in their hand, trash 2 cards from your opponent's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 2,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -3,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op03Issho078I18n,
};
