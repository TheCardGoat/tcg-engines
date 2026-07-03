import type { CharacterCard } from "@tcg/op-types";
import { op07IsshoSp078I18n } from "./078-issho-sp.i18n.ts";

export const op07IsshoSp078: CharacterCard = {
  id: "OP03-078",
  canonicalId: "OP03-078",
  slug: "issho-sp",
  name: "Issho (SP)",
  printings: [
    {
      id: "OP03-078",
      artId: "OP03-078",
      setCode: "OP07",
      collectorNumber: "078",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-078_p2.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP07",
  cost: 8,
  power: 9000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[DON!! x1][Your Turn] Give all of your opponent's Characters -3 cost. [On Play] If your opponent has 6 or more cards in their hand, trash 2 cards from your opponent's hand.",
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
  i18n: op07IsshoSp078I18n,
};
