import type { CharacterCard } from "@tcg/op-types";
import { eb03Baccarat007I18n } from "./007-baccarat.i18n.ts";

export const eb03Baccarat007: CharacterCard = {
  id: "EB03-007",
  canonicalId: "EB03-007",
  slug: "baccarat/eb03-007",
  name: "Baccarat",
  printings: [
    {
      id: "EB03-007",
      artId: "EB03-007",
      setCode: "EB03",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-007_SZkcJpK.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["FILM Grantesoro"],
  attribute: "special",
  effect:
    "[Blocker] [On K.O.] Play up to 1 Character card with 6000 power or less and no base effect from your hand.",
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
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "hasEffectType",
                value: "onPlay",
                negate: true,
              },
              {
                filter: "power",
                comparison: "lte",
                value: 6000,
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
  i18n: eb03Baccarat007I18n,
};
