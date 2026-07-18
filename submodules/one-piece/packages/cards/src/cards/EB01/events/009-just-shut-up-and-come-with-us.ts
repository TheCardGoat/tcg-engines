import type { EventCard } from "@tcg/op-types";
import { eb01JustShutUpAndComeWithUs009I18n } from "./009-just-shut-up-and-come-with-us.i18n.ts";

export const eb01JustShutUpAndComeWithUs009: EventCard = {
  id: "EB01-009",
  canonicalId: "EB01-009",
  slug: "just-shut-up-and-come-with-us",
  name: "Just Shut Up and Come with Us!!!!",
  printings: [
    {
      id: "EB01-009",
      artId: "EB01-009",
      setCode: "EB01",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-009.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "EB01",
  cost: 1,
  traits: ["Straw Hat Crew Drum Kingdom"],
  effect:
    "[Counter] Look at 5 cards from the top of your deck and play up to 1 [Animal] type Character card with a cost of 3 or less. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "Animal",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: eb01JustShutUpAndComeWithUs009I18n,
};
