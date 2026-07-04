import type { CharacterCard } from "@tcg/op-types";
import { op09JeanBart066I18n } from "./066-jean-bart.i18n.ts";

export const op09JeanBart066: CharacterCard = {
  id: "OP09-066",
  canonicalId: "OP09-066",
  slug: "jean-bart/op09-066",
  name: "Jean Bart",
  printings: [
    {
      id: "OP09-066",
      artId: "OP09-066",
      setCode: "OP09",
      collectorNumber: "066",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-066.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  power: 6000,
  traits: ["Heart Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If your opponent has more DON!! cards on their field than you, K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lt",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09JeanBart066I18n,
};
