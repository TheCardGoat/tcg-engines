import type { CharacterCard } from "@tcg/op-types";
import { eb01Kalifa031I18n } from "./031-kalifa.i18n.ts";

export const eb01Kalifa031: CharacterCard = {
  id: "EB01-031",
  canonicalId: "EB01-031",
  slug: "kalifa/eb01-031",
  name: "Kalifa",
  printings: [
    {
      id: "EB01-031",
      artId: "EB01-031",
      setCode: "EB01",
      collectorNumber: "031",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-031.jpg",
    },
    {
      id: "EB01-031_p1",
      artId: "EB01-031_p1",
      setCode: "EB01",
      collectorNumber: "031",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-031_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "EB01",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-031_p1.jpg",
      imageId: "EB01-031_p1",
    },
  ],
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, add up to 2 Character cards with a cost of 4 or less from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            condition: {
              condition: "leaderTrait",
              trait: "Water Seven",
              match: "includes",
            },
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01Kalifa031I18n,
};
