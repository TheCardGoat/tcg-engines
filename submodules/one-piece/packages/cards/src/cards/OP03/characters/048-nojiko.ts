import type { CharacterCard } from "@tcg/op-types";
import { op03Nojiko048I18n } from "./048-nojiko.i18n.ts";

export const op03Nojiko048: CharacterCard = {
  id: "OP03-048",
  canonicalId: "OP03-048",
  slug: "nojiko",
  name: "Nojiko",
  printings: [
    {
      id: "OP03-048",
      artId: "OP03-048",
      setCode: "OP03",
      collectorNumber: "048",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-048.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "[On Play] If your Leader is [Nami], return up to 1 of your opponent's Characters with a cost of 5 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Nami",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03Nojiko048I18n,
};
