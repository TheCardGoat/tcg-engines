import type { CharacterCard } from "@tcg/op-types";
import { op02Brook040I18n } from "./040-brook.i18n.ts";

export const op02Brook040: CharacterCard = {
  id: "OP02-040",
  canonicalId: "OP02-040",
  slug: "brook/op02-040",
  name: "Brook",
  printings: [
    {
      id: "OP02-040",
      artId: "OP02-040",
      setCode: "OP02",
      collectorNumber: "040",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-040.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[On Play] Play up to 1 [FILM] or [Straw Hat Crew] type Character card with a cost of 3 or less from your hand.",
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
                filter: "trait",
                value: "FILM",
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
        ],
      },
    ],
  },
  i18n: op02Brook040I18n,
};
