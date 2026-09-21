import type { StageCard } from "@tcg/op-types";
import { op05MaryGeoise097I18n } from "./op05-097-mary-geoise.i18n.ts";

export const op05MaryGeoise097: StageCard = {
  id: "OP05-097",
  canonicalId: "OP05-097",
  slug: "mary-geoise",
  name: "Mary Geoise",
  printings: [
    {
      id: "OP05-097",
      artId: "OP05-097",
      setCode: "OP05",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097.jpg",
    },
    {
      id: "OP05-097_p1",
      artId: "OP05-097_p1",
      setCode: "OP05",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p1.jpg",
    },
    {
      id: "OP05-097_p2",
      artId: "OP05-097_p2",
      setCode: "OP05",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_p2.jpg",
      label: "Mary Geoise (Alternate Art)",
    },
    {
      id: "OP05-097_r1",
      artId: "OP05-097_r1",
      setCode: "OP05",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-097_r1.jpg",
      label: "Mary Geoise (Reprint)",
    },
  ],
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  traits: ["Mary Geoise"],
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
                  match: "includes",
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
  i18n: op05MaryGeoise097I18n,
};
