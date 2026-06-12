import type { CharacterCard } from "@tcg/op-types";
import { op10Franky090I18n } from "./090-franky.i18n.ts";

export const op10Franky090: CharacterCard = {
  id: "OP10-090",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-090_p1.jpg",
      imageId: "OP10-090_p1",
    },
  ],
  effect:
    '[Blocker]\n[On K.O.] Play up to 1 "Dressrosa" type Character card with a cost of 3 or less from your trash rested.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
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
                value: 3,
              },
              {
                filter: "trait",
                value: "Dressrosa",
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
  i18n: op10Franky090I18n,
};
