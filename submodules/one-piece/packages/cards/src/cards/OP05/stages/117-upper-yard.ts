import type { StageCard } from "@tcg/op-types";
import { op05UpperYard117I18n } from "./117-upper-yard.i18n.ts";

export const op05UpperYard117: StageCard = {
  id: "OP05-117",
  canonicalId: "OP05-117",
  slug: "upper-yard",
  name: "Upper Yard",
  printings: [
    {
      id: "OP05-117",
      artId: "OP05-117",
      setCode: "OP05",
      collectorNumber: "117",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-117.jpg",
    },
  ],
  cardType: "stage",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  traits: ["Sky Island"],
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
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05UpperYard117I18n,
};
