import type { EventCard } from "@tcg/op-types";
import { op09Dereshi117I18n } from "./117-dereshi.i18n.ts";

export const op09Dereshi117: EventCard = {
  id: "OP09-117",
  canonicalId: "OP09-117",
  slug: "dereshi",
  name: "Dereshi!",
  printings: [
    {
      id: "OP09-117",
      artId: "OP09-117",
      setCode: "OP09",
      collectorNumber: "117",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-117.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP09",
  cost: 3,
  trigger: "Draw 1 card.",
  traits: ["Ohara"],
  effect:
    "[Main] Look at 5 cards from the top of your deck; reveal up to 2 cards with a [Trigger] other than [Dereshi!] and add them to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 2,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "excludeName",
                value: "Dereshi!",
              },
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
  i18n: op09Dereshi117I18n,
};
