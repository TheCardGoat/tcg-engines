import type { EventCard } from "@tcg/op-types";
import { eb02BrandNewWorld040I18n } from "./040-brand-new-world.i18n.ts";

export const eb02BrandNewWorld040: EventCard = {
  id: "EB02-040",
  canonicalId: "EB02-040",
  slug: "brand-new-world",
  name: "BRAND NEW WORLD",
  printings: [
    {
      id: "EB02-040",
      artId: "EB02-040",
      setCode: "EB02",
      collectorNumber: "040",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-040.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "EB02",
  cost: 2,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Music"],
  effect:
    "[Main] Look at 4 cards from the top of your deck; reveal up to 1 card with a cost of 4 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                filter: "cost",
                comparison: "gte",
                value: 4,
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
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: eb02BrandNewWorld040I18n,
};
