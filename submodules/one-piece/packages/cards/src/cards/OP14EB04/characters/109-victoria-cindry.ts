import type { CharacterCard } from "@tcg/op-types";
import { op14eb04VictoriaCindry109I18n } from "./109-victoria-cindry.i18n.ts";

export const op14eb04VictoriaCindry109: CharacterCard = {
  id: "OP14-109",
  canonicalId: "OP14-109",
  slug: "victoria-cindry/op14-109",
  name: "Victoria Cindry",
  printings: [
    {
      id: "OP14-109",
      artId: "OP14-109",
      setCode: "OP14EB04",
      collectorNumber: "109",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-109_4wYat9N.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 1000,
  counter: 1000,
  trigger:
    "Play up to 1 {Thriller Bark Pirates} type Character card with a cost of 4 or less from your trash rested.",
  traits: ["Thriller Bark Pirates"],
  attribute: "slash",
  effect: "[Blocker]",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
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
                filter: "trait",
                value: "Thriller Bark Pirates",
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
  i18n: op14eb04VictoriaCindry109I18n,
};
