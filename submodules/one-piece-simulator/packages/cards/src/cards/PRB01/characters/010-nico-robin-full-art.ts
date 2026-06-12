import type { CharacterCard } from "@tcg/op-types";
import { prb01NicoRobinFullArt010I18n } from "./010-nico-robin-full-art.i18n.ts";

export const prb01NicoRobinFullArt010: CharacterCard = {
  id: "OP05-010",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-010_p2.jpg",
      imageId: "OP05-010_p2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-010_r1.jpg",
      imageId: "OP05-010_r1",
    },
  ],
  effect: "[On Play] K.O. up to 1 of your opponent's Characters with 1000 power or less.",
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
                  filter: "power",
                  comparison: "lte",
                  value: 1000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb01NicoRobinFullArt010I18n,
};
