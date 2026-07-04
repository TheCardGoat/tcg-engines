import type { EventCard } from "@tcg/op-types";
import { op01BaroqueWorks090I18n } from "./090-baroque-works.i18n.ts";

export const op01BaroqueWorks090: EventCard = {
  id: "OP01-090",
  canonicalId: "OP01-090",
  slug: "baroque-works",
  name: "Baroque Works",
  printings: [
    {
      id: "OP01-090",
      artId: "OP01-090",
      setCode: "OP01",
      collectorNumber: "090",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-090.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  traits: ["Baroque Works"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 "Baroque Works" type card other than [Baroque Works] and add it to your hand. Then, place the rest at the bottom of your deck in any order.  This card has been officially errata\'d.',
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
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "excludeName",
                value: "Baroque Works",
              },
              {
                filter: "trait",
                value: "Baroque Works",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op01BaroqueWorks090I18n,
};
