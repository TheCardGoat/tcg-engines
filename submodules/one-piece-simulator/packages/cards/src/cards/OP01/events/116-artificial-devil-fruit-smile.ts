import type { EventCard } from "@tcg/op-types";
import { op01ArtificialDevilFruitSmile116I18n } from "./116-artificial-devil-fruit-smile.i18n.ts";

export const op01ArtificialDevilFruitSmile116: EventCard = {
  id: "OP01-116",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 2,
  traits: ["Animal Kingdom Pirates SMILE"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; play up to 1 "SMILE" type Character card with a cost of 3 or less. Then, place the rest at the bottom of your deck in any order.  This card has been officially errata\'d.',
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
  i18n: op01ArtificialDevilFruitSmile116I18n,
};
