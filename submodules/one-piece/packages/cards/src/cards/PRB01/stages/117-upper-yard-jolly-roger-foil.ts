import type { StageCard } from "@tcg/op-types";
import { prb01UpperYardJollyRogerFoil117I18n } from "./117-upper-yard-jolly-roger-foil.i18n.ts";

export const prb01UpperYardJollyRogerFoil117: StageCard = {
  id: "OP05-117",
  canonicalId: "OP05-117",
  slug: "upper-yard-jolly-roger-foil",
  name: "Upper Yard (Jolly Roger Foil)",
  printings: [
    {
      id: "OP05-117",
      artId: "OP05-117",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p2.jpg",
    },
    {
      id: "OP05-117_p3",
      artId: "OP05-117_p3",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p3.jpg",
    },
    {
      id: "OP05-117_r1",
      artId: "OP05-117_r1",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_r1.png",
    },
    {
      id: "OP05-117_p4",
      artId: "OP05-117_p4",
      setCode: "PRB01",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p4.jpg",
    },
  ],
  cardType: "stage",
  color: ["yellow"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  traits: ["Sky Island"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p3.jpg",
      imageId: "OP05-117_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_r1.png",
      imageId: "OP05-117_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117_p4.jpg",
      imageId: "OP05-117_p4",
    },
  ],
  effect:
    "[On Play] Look at the top 5 cards of your deck; reveal up to 1 [Sky Island] type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Sky Island",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb01UpperYardJollyRogerFoil117I18n,
};
