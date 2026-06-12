import type { CharacterCard } from "@tcg/op-types";
import { eb03NefeltariVivi024I18n } from "./024-nefeltari-vivi.i18n.ts";

export const eb03NefeltariVivi024: CharacterCard = {
  id: "EB03-024",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "EB03",
  cost: 5,
  power: 4000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-024_p2.jpg",
      imageId: "EB03-024_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-024_p1_rPzIWnn.jpg",
      imageId: "EB03-024_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Play] Play up to 1 {Alabasta} or {Straw Hat Crew} type Character card with a cost of 5 or less from your hand. Then, you cannot play any Character cards on your field during this turn.",
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
              zone: "hand",
            },
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
              {
                filter: "trait",
                value: "Alabasta",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
          {
            action: "playRestriction",
            restriction: "cannotPlay",
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb03NefeltariVivi024I18n,
};
