import type { EventCard } from "@tcg/op-types";
import { op08ThankYouForLovingMe053I18n } from "./053-thank-you-for-loving-me.i18n.ts";

export const op08ThankYouForLovingMe053: EventCard = {
  id: "OP08-053",
  canonicalId: "OP08-053",
  slug: "thank-you-for-loving-me",
  name: "Thank You...for Loving Me!!",
  printings: [
    {
      id: "OP08-053",
      artId: "OP08-053",
      setCode: "OP08",
      collectorNumber: "053",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-053.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Main] If your Leader\'s type includes "Whitebeard Pirates", look at 3 cards from the top of your deck; reveal up to 1 card with a type including "Whitebeard Pirates" or [Monkey.D.Luffy] and add it to your hand. Then, place the rest at the top or bottom of your deck in any order. [Trigger] Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
            match: "includes",
          },
        ],
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Whitebeard Pirates",
                    match: "includes",
                  },
                  {
                    filter: "name",
                    value: "Monkey.D.Luffy",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "any",
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
  i18n: op08ThankYouForLovingMe053I18n,
};
