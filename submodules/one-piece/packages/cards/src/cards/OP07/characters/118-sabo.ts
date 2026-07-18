import type { CharacterCard } from "@tcg/op-types";
import { op07Sabo118I18n } from "./118-sabo.i18n.ts";

export const op07Sabo118: CharacterCard = {
  id: "OP07-118",
  canonicalId: "OP07-118",
  slug: "sabo/op07-118",
  name: "Sabo",
  printings: [
    {
      id: "OP07-118",
      artId: "OP07-118",
      setCode: "OP07",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-118.jpg",
    },
    {
      id: "OP07-118_p1",
      artId: "OP07-118_p1",
      setCode: "OP07",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-118_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP07",
  cost: 8,
  power: 9000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-118_p1.jpg",
      imageId: "OP07-118_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less and up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
                  value: 5,
                },
              ],
            },
          },
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
  i18n: op07Sabo118I18n,
};
