import type { CharacterCard } from "@tcg/op-types";
import { op15Viola040I18n } from "./op15-040-viola.i18n.ts";

export const op15Viola040: CharacterCard = {
  id: "OP15-040",
  canonicalId: "OP15-040",
  slug: "viola/op15-040",
  name: "Viola",
  printings: [
    {
      id: "OP15-040",
      artId: "OP15-040",
      setCode: "OP15",
      collectorNumber: "040",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-040_DpSKRqX.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Donquixote Pirates Dressrosa"],
  attribute: "special",
  effect:
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 {Dressrosa} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "trait",
                value: "Dressrosa",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op15Viola040I18n,
};
