import type { StageCard } from "@tcg/op-types";
import { prb02MaryGeoisePirateFoil097I18n } from "./097-mary-geoise-pirate-foil.i18n.ts";

export const prb02MaryGeoisePirateFoil097: StageCard = {
  id: "OP05-097",
  canonicalId: "OP05-097",
  slug: "mary-geoise-pirate-foil",
  name: "Mary Geoise (Pirate Foil)",
  printings: [
    {
      id: "OP05-097",
      artId: "OP05-097",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p1.jpg",
    },
    {
      id: "OP05-097_r1",
      artId: "OP05-097_r1",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_r1.jpg",
    },
    {
      id: "OP05-097_p2",
      artId: "OP05-097_p2",
      setCode: "PRB02",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p2.jpg",
    },
  ],
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Mary Geoise"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_r1.jpg",
      imageId: "OP05-097_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p2.jpg",
      imageId: "OP05-097_p2",
    },
  ],
  effect:
    "[Your Turn] The cost of playing [Celestial Dragons] type Character cards with a cost of 2 or more from your hand will be reduced by 1.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Celestial Dragons",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 2,
                },
              ],
            },
            value: -1,
          },
        ],
      },
    ],
  },
  i18n: prb02MaryGeoisePirateFoil097I18n,
};
