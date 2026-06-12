import type { CharacterCard } from "@tcg/op-types";
import { prb01NamiP053FullArt053I18n } from "./053-nami-p-053-full-art.i18n.ts";

export const prb01NamiP053FullArt053: CharacterCard = {
  id: "P-053",
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "PRB01",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-053_p2.jpg",
      imageId: "P-053_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-053_r1.jpg",
      imageId: "P-053_r1",
    },
  ],
  effect:
    "[On Play] If you have 3 or less cards in your hand, return up to 1 of your opponent's Characters with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 3,
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
      },
    ],
  },
  i18n: prb01NamiP053FullArt053I18n,
};
