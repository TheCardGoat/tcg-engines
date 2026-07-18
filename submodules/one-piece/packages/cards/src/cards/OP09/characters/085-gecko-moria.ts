import type { CharacterCard } from "@tcg/op-types";
import { op09GeckoMoria085I18n } from "./085-gecko-moria.i18n.ts";

export const op09GeckoMoria085: CharacterCard = {
  id: "OP09-085",
  canonicalId: "OP09-085",
  slug: "gecko-moria/op09-085",
  name: "Gecko Moria",
  printings: [
    {
      id: "OP09-085",
      artId: "OP09-085",
      setCode: "OP09",
      collectorNumber: "085",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-085.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 5000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  effect:
    '[On Play] Play up to 1 "Thriller Bark Pirates" type Character card with a cost of 2 or less from your trash rested.',
  effects: {
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
                value: 2,
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
                match: "includes",
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
  i18n: op09GeckoMoria085I18n,
};
