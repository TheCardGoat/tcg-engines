import type { CharacterCard } from "@tcg/op-types";
import { eb03VinsmokeReiju031I18n } from "./031-vinsmoke-reiju.i18n.ts";

export const eb03VinsmokeReiju031: CharacterCard = {
  id: "EB03-031",
  canonicalId: "EB03-031",
  slug: "vinsmoke-reiju/eb03-031",
  name: "Vinsmoke Reiju",
  printings: [
    {
      id: "EB03-031",
      artId: "EB03-031",
      setCode: "EB03",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-031_pj32ahE.jpg",
    },
    {
      id: "EB03-031_p2",
      artId: "EB03-031_p2",
      setCode: "EB03",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-031_p2_x7r9oMT.jpg",
    },
    {
      id: "EB03-031_p1",
      artId: "EB03-031_p1",
      setCode: "EB03",
      collectorNumber: "031",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-031_p1_5nabW5C.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "EB03",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-031_p2_x7r9oMT.jpg",
      imageId: "EB03-031_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-031_p1_5nabW5C.jpg",
      imageId: "EB03-031_p1",
    },
  ],
  effect:
    "[Your Turn] [On Play] DON!! −1: If your Leader is [Sanji], activate the [Main] effect of up to 1 Event card with a cost of 7 or less in your trash.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "activateEffect",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "event",
                },
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
            effectTrigger: "main",
            condition: {
              condition: "leaderName",
              name: "Sanji",
            },
          },
        ],
      },
    ],
  },
  i18n: eb03VinsmokeReiju031I18n,
};
