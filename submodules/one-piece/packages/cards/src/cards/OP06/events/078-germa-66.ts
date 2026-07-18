import type { EventCard } from "@tcg/op-types";
import { op06Germa66078I18n } from "./078-germa-66.i18n.ts";

export const op06Germa66078: EventCard = {
  id: "OP06-078",
  canonicalId: "OP06-078",
  slug: "germa-66/op06-078",
  name: "GERMA 66",
  printings: [
    {
      id: "OP06-078",
      artId: "OP06-078",
      setCode: "OP06",
      collectorNumber: "078",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-078.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP06",
  cost: 1,
  trigger: "Draw 1 card.",
  traits: ["The Vinsmoke Family GERMA 66"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "GERMA" other than [GERMA 66] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "GERMA 66",
              },
              {
                filter: "trait",
                value: "GERMA",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
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
  i18n: op06Germa66078I18n,
};
