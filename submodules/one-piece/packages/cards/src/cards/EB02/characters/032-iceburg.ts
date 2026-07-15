import type { CharacterCard } from "@tcg/op-types";
import { eb02Iceburg032I18n } from "./032-iceburg.i18n.ts";

export const eb02Iceburg032: CharacterCard = {
  id: "EB02-032",
  canonicalId: "EB02-032",
  slug: "iceburg/eb02-032",
  name: "Iceburg",
  printings: [
    {
      id: "EB02-032",
      artId: "EB02-032",
      setCode: "EB02",
      collectorNumber: "032",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-032.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB02",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "wisdom",
  effect:
    "[On Play] If you have 3 or more DON!! cards on your field, look at 7 cards from the top of your deck; reveal up to 1 [Galley-La Company] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Galley-La Company] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 7,
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
                filter: "name",
                value: "Galley-La Company",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
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
                filter: "name",
                value: "Galley-La Company",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02Iceburg032I18n,
};
