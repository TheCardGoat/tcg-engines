import type { EventCard } from "@tcg/op-types";
import { op01ArtificialDevilFruitSmile116I18n } from "./116-artificial-devil-fruit-smile.i18n.ts";

export const op01ArtificialDevilFruitSmile116: EventCard = {
  id: "OP01-116",
  canonicalId: "OP01-116",
  slug: "artificial-devil-fruit-smile",
  name: "Artificial Devil Fruit SMILE",
  printings: [
    {
      id: "OP01-116",
      artId: "OP01-116",
      setCode: "OP01",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-116.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 2,
  traits: ["Animal Kingdom Pirates SMILE"],
  effect:
    "[Main] Look at 5 cards from the top of your deck; play up to 1 \"SMILE\" type Character card with a cost of 3 or less. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card's [Main] effect.  This card has been officially errata'd.",
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
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "trait",
                value: "SMILE",
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
  i18n: op01ArtificialDevilFruitSmile116I18n,
};
