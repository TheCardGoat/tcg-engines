import type { EventCard } from "@tcg/op-types";
import { prb01IceAgeTexturedFoil117I18n } from "./117-ice-age-textured-foil.i18n.ts";

export const prb01IceAgeTexturedFoil117: EventCard = {
  id: "OP02-117",
  canonicalId: "OP02-117",
  slug: "ice-age-textured-foil",
  name: "Ice Age (Textured Foil)",
  printings: [
    {
      id: "OP02-117",
      artId: "OP02-117",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p6.jpg",
    },
    {
      id: "OP02-117_p5",
      artId: "OP02-117_p5",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p5.jpg",
    },
    {
      id: "OP02-117_r2",
      artId: "OP02-117_r2",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_r2.png",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  traits: ["Navy"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_p5.jpg",
      imageId: "OP02-117_p5",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-117_r2.png",
      imageId: "OP02-117_r2",
    },
  ],
  effect:
    "[Main] Give up to 1 of your opponent's Characters -5 cost during this turn.[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -5,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
  i18n: prb01IceAgeTexturedFoil117I18n,
};
