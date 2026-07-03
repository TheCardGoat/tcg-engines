import type { CharacterCard } from "@tcg/op-types";
import { op01Alvida064I18n } from "./064-alvida.i18n.ts";

export const op01Alvida064: CharacterCard = {
  id: "OP01-064",
  canonicalId: "OP01-064",
  slug: "alvida/op01-064",
  name: "Alvida",
  printings: [
    {
      id: "OP01-064",
      artId: "OP01-064",
      setCode: "OP01",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-064.jpg",
    },
    {
      id: "OP01-064_p1",
      artId: "OP01-064_p1",
      setCode: "OP01",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-064_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Buggy Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-064_p1.jpg",
      imageId: "OP01-064_p1",
    },
  ],
  effect:
    "[DON!! x1] [When Attacking] You may trash 1 card from your hand: Return up to 1 of your opponent's Characters with a cost of 3 or less to the owner's hand.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01Alvida064I18n,
};
