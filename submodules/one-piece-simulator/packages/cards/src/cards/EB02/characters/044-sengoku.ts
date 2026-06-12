import type { CharacterCard } from "@tcg/op-types";
import { eb02Sengoku044I18n } from "./044-sengoku.i18n.ts";

export const eb02Sengoku044: CharacterCard = {
  id: "EB02-044",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "EB02",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-044_p1.png",
      imageId: "EB02-044_p1",
    },
  ],
  effect:
    '[Blocker]\n[On Play] Play up to 1 black "Navy" type Character card with a cost of 4 or less from your trash rested.',
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "color",
                value: "black",
              },
              {
                filter: "trait",
                value: "Navy",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: eb02Sengoku044I18n,
};
