import type { CharacterCard } from "@tcg/op-types";
import { op05Sabo007I18n } from "./op05-007-sabo.i18n.ts";

export const op05Sabo007: CharacterCard = {
  id: "OP05-007",
  canonicalId: "OP05-007",
  slug: "sabo/op05-007",
  name: "Sabo",
  printings: [
    {
      id: "OP05-007",
      artId: "OP05-007",
      setCode: "OP05",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007.jpg",
    },
    {
      id: "OP05-007_p1",
      artId: "OP05-007_p1",
      setCode: "OP05",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_p1.jpg",
    },
    {
      id: "OP05-007_p3",
      artId: "OP05-007_p3",
      setCode: "OP05",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_p3.jpg",
      label: "Sabo (OP05-007) (Alternate Art)",
    },
    {
      id: "OP05-007_r1",
      artId: "OP05-007_r1",
      setCode: "OP05",
      collectorNumber: "007",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP05",
  cost: 6,
  power: 7000,
  traits: ["Revolutionary Army"],
  attribute: "special",

  effect:
    "[On Play] K.O. up to 2 of your opponent's Characters with a total power of 4000 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              totalConstraint: {
                property: "power",
                comparison: "lte",
                value: 4000,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op05Sabo007I18n,
};
