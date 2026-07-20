import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Aladine043I18n } from "./043-aladine.i18n.ts";

export const op14eb04Aladine043: CharacterCard = {
  id: "OP14-043",
  canonicalId: "OP14-043",
  slug: "aladine/op14-043",
  name: "Aladine",
  printings: [
    {
      id: "OP14-043",
      artId: "OP14-043",
      setCode: "OP14EB04",
      collectorNumber: "043",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-043_bDHoLaK.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Merfolk", "The Sun Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Play up to 1 {Fish-Man} or {Merfolk} type Character card with a cost of 3 or less from your hand.\n[On K.O.] Draw 1 card.",
  effects: {
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
                value: 3,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Fish-Man",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Merfolk",
                    match: "includes",
                  },
                ],
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Aladine043I18n,
};
