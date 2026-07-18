import type { EventCard } from "@tcg/op-types";
import { op13TheOneWhoIsTheMostFreeIsThePirateKing116I18n } from "./116-the-one-who-is-the-most-free-is-the-pirate-king.i18n.ts";

export const op13TheOneWhoIsTheMostFreeIsThePirateKing116: EventCard = {
  id: "OP13-116",
  canonicalId: "OP13-116",
  slug: "the-one-who-is-the-most-free-is-the-pirate-king",
  name: "The One Who Is the Most Free Is the Pirate King!!!",
  printings: [
    {
      id: "OP13-116",
      artId: "OP13-116",
      setCode: "OP13",
      collectorNumber: "116",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-116_yr69sF2.jpg",
    },
  ],
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
                match: "includes",
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
  i18n: op13TheOneWhoIsTheMostFreeIsThePirateKing116I18n,
};
