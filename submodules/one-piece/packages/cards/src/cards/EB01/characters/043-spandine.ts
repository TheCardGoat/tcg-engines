import type { CharacterCard } from "@tcg/op-types";
import { eb01Spandine043I18n } from "./043-spandine.i18n.ts";

export const eb01Spandine043: CharacterCard = {
  id: "EB01-043",
  canonicalId: "EB01-043",
  slug: "spandine",
  name: "Spandine",
  printings: [
    {
      id: "EB01-043",
      artId: "EB01-043",
      setCode: "EB01",
      collectorNumber: "043",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-043.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB01",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "wisdom",
  effect:
    '[On Play] You may place 3 cards with a type including "CP" from your trash at the bottom of your deck in any order: Play up to 1 Character card with a type including "CP" and a cost of 4 or less other than [Spandine] from your trash rested.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 3,
            position: "bottom",
            filters: [
              {
                filter: "trait",
                value: "CP",
                match: "includes",
              },
            ],
          },
        ],
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
                value: "Spandine",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "CP",
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
        optional: true,
      },
    ],
  },
  i18n: eb01Spandine043I18n,
};
