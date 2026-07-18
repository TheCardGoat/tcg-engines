import type { CharacterCard } from "@tcg/op-types";
import { op04Rebecca092I18n } from "./092-rebecca.i18n.ts";

export const op04Rebecca092: CharacterCard = {
  id: "OP04-092",
  canonicalId: "OP04-092",
  slug: "rebecca/op04-092",
  name: "Rebecca",
  printings: [
    {
      id: "OP04-092",
      artId: "OP04-092",
      setCode: "OP04",
      collectorNumber: "092",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-092.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "slash",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 [Dressrosa] type card other than [Rebecca] and add it to your hand. Then, trash the rest.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                filter: "excludeName",
                value: "Rebecca",
              },
              {
                filter: "trait",
                value: "Dressrosa",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "trash",
          },
        ],
      },
    ],
  },
  i18n: op04Rebecca092I18n,
};
