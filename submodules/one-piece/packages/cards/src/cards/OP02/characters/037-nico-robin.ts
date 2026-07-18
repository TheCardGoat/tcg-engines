import type { CharacterCard } from "@tcg/op-types";
import { op02NicoRobin037I18n } from "./037-nico-robin.i18n.ts";

export const op02NicoRobin037: CharacterCard = {
  id: "OP02-037",
  canonicalId: "OP02-037",
  slug: "nico-robin/op02-037",
  name: "Nico Robin",
  printings: [
    {
      id: "OP02-037",
      artId: "OP02-037",
      setCode: "OP02",
      collectorNumber: "037",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-037.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Film Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Play up to 1 [FILM] or [Straw Hat Crew] type Character card with a cost of 2 or less from your hand.",
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
                value: 2,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "FILM",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Straw Hat Crew",
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
    ],
  },
  i18n: op02NicoRobin037I18n,
};
