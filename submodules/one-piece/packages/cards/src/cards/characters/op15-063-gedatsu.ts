import type { CharacterCard } from "@tcg/op-types";
import { op15Gedatsu063I18n } from "./op15-063-gedatsu.i18n.ts";

export const op15Gedatsu063: CharacterCard = {
  id: "OP15-063",
  canonicalId: "OP15-063",
  slug: "gedatsu/op15-063",
  name: "Gedatsu",
  printings: [
    {
      id: "OP15-063",
      artId: "OP15-063",
      setCode: "OP15",
      collectorNumber: "063",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-063_jiHtvL7.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Sky Island Vassals"],
  attribute: "strike",
  effect:
    "[On Play] DON!! -1: Draw 1 card.\n[On K.O.] If you have 6 or less DON!! cards on your field, K.O. up to 1 of your opponent's Characters with 2000 power or less.",
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
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "lte",
            value: 6,
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
                  filter: "power",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op15Gedatsu063I18n,
};
