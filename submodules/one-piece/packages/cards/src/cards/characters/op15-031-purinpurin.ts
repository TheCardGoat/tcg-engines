import type { CharacterCard } from "@tcg/op-types";
import { op15Purinpurin031I18n } from "./op15-031-purinpurin.i18n.ts";

export const op15Purinpurin031: CharacterCard = {
  id: "OP15-031",
  canonicalId: "OP15-031",
  slug: "purinpurin/op15-031",
  name: "Purinpurin",
  printings: [
    {
      id: "OP15-031",
      artId: "OP15-031",
      setCode: "OP15",
      collectorNumber: "031",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-031_9mLTRez.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP15",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Navy East Blue"],
  attribute: "wisdom",
  effect:
    "[On Play] Select up to 1 of your opponent's rested Characters. If the chosen Character has a cost equal to the number of DON!! cards given to it, K.O. it.",
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
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "dynamicCost",
                  comparison: "eq",
                  source: "candidateAttachedDon",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op15Purinpurin031I18n,
};
