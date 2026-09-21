import type { CharacterCard } from "@tcg/op-types";
import { op16KouzukiMomonosuke085I18n } from "./op16-085-kouzuki-momonosuke.i18n.ts";

export const op16KouzukiMomonosuke085: CharacterCard = {
  id: "OP16-085",
  canonicalId: "OP16-085",
  slug: "kouzuki-momonosuke/op16-085",
  name: "Kouzuki Momonosuke",
  printings: [
    {
      id: "OP16-085",
      artId: "OP16-085",
      setCode: "OP16",
      collectorNumber: "085",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-085_Mq3HpaM.jpg",
      label: "Kouzuki Momonosuke (085)",
    },
    {
      id: "OP16-085_p1",
      artId: "OP16-085_p1",
      setCode: "OP16",
      collectorNumber: "085",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-085_p1_GF8c8fm.jpg",
      label: "Kouzuki Momonosuke (085) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP16",
  cost: 9,
  power: 6000,
  counter: 1000,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "special",
  effect:
    "[Blocker] [On Play] Play up to 1 {Land of Wano} type Character card with a cost of 6 or less other than [Kouzuki Momonosuke] from your trash.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Kouzuki Momonosuke",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 6,
              },
              {
                filter: "trait",
                value: "Land of Wano",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op16KouzukiMomonosuke085I18n,
};
