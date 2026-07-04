import type { CharacterCard } from "@tcg/op-types";
import { op11CaponeGangBege048I18n } from "./048-capone-gang-bege.i18n.ts";

export const op11CaponeGangBege048: CharacterCard = {
  id: "OP11-048",
  canonicalId: "OP11-048",
  slug: "capone-gang-bege/op11-048",
  name: 'Capone"Gang"Bege',
  printings: [
    {
      id: "OP11-048",
      artId: "OP11-048",
      setCode: "OP11",
      collectorNumber: "048",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-048.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Firetank Pirates Supernovas"],
  attribute: "ranged",
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Firetank Pirates" or "Straw Hat Crew" type card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: 2,
              },
              {
                filter: "trait",
                value: "Firetank Pirates",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op11CaponeGangBege048I18n,
};
