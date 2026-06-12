import type { EventCard } from "@tcg/op-types";
import { op13TheOneWhoIsTheMostFreeIsThePirateKing116I18n } from "./116-the-one-who-is-the-most-free-is-the-pirate-king.i18n.ts";

export const op13TheOneWhoIsTheMostFreeIsThePirateKing116: EventCard = {
  id: "OP13-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP13",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Straw Hat Crew Supernovas"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 "Supernovas" type Character card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "trait",
                value: "Supernovas",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op13TheOneWhoIsTheMostFreeIsThePirateKing116I18n,
};
