import type { EventCard } from "@tcg/op-types";
import { prb02JustShutUpAndComeWithUsPirateFoil009I18n } from "./009-just-shut-up-and-come-with-us-pirate-foil.i18n.ts";

export const prb02JustShutUpAndComeWithUsPirateFoil009: EventCard = {
  id: "EB01-009",
  canonicalId: "EB01-009",
  slug: "just-shut-up-and-come-with-us-pirate-foil",
  name: "Just Shut Up and Come with Us!!!! (Pirate Foil)",
  printings: [
    {
      id: "EB01-009",
      artId: "EB01-009",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-009_p1.jpg",
    },
    {
      id: "EB01-009_r1",
      artId: "EB01-009_r1",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-009_r1.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Straw Hat Crew Drum Kingdom"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-009_r1.jpg",
      imageId: "EB01-009_r1",
    },
  ],
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
  i18n: prb02JustShutUpAndComeWithUsPirateFoil009I18n,
};
