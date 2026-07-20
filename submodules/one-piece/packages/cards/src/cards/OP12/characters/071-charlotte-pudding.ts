import type { CharacterCard } from "@tcg/op-types";
import { op12CharlottePudding071I18n } from "./071-charlotte-pudding.i18n.ts";

export const op12CharlottePudding071: CharacterCard = {
  id: "OP12-071",
  canonicalId: "OP12-071",
  slug: "charlotte-pudding/op12-071",
  name: "Charlotte Pudding",
  printings: [
    {
      id: "OP12-071",
      artId: "OP12-071",
      setCode: "OP12",
      collectorNumber: "071",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-071_g3KCZwi.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP12",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 [Sanji] or Event card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "Sanji",
                  },
                  {
                    filter: "cardCategory",
                    value: "event",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12CharlottePudding071I18n,
};
