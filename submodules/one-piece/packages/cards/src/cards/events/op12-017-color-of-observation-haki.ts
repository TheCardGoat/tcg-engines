import type { EventCard } from "@tcg/op-types";
import { op12ColorOfObservationHaki017I18n } from "./op12-017-color-of-observation-haki.i18n.ts";

export const op12ColorOfObservationHaki017: EventCard = {
  id: "OP12-017",
  canonicalId: "OP12-017",
  slug: "color-of-observation-haki/op12-017",
  name: "Color of Observation Haki",
  printings: [
    {
      id: "OP12-017",
      artId: "OP12-017",
      setCode: "OP12",
      collectorNumber: "017",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-017_D1lZ350.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP12",
  cost: 0,
  traits: ["Former Roger Pirates"],
  effect:
    "[Main] You may give 1 active DON!! card to 1 of your [Silvers Rayleigh]: Look at 4 cards from the top of your deck; reveal up to 1 red Event or up to 1 Character card with a cost of 3 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "giveDon",
            amount: 1,
            recipientFilters: [
              {
                filter: "name",
                value: "Silvers Rayleigh",
              },
            ],
          },
        ],
        optional: true,
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                    filter: "allOf",
                    filters: [
                      {
                        filter: "cardCategory",
                        value: "event",
                      },
                      {
                        filter: "color",
                        value: "red",
                      },
                    ],
                  },
                  {
                    filter: "allOf",
                    filters: [
                      {
                        filter: "cardCategory",
                        value: "character",
                      },
                      { filter: "color", value: "red" },
                      {
                        filter: "cost",
                        comparison: "gte",
                        value: 3,
                      },
                    ],
                  },
                ],
              },
            ],
            revealFilterMode: "all",
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op12ColorOfObservationHaki017I18n,
};
