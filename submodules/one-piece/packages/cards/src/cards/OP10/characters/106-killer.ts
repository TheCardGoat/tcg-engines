import type { CharacterCard } from "@tcg/op-types";
import { op10Killer106I18n } from "./106-killer.i18n.ts";

export const op10Killer106: CharacterCard = {
  id: "OP10-106",
  canonicalId: "OP10-106",
  slug: "killer/op10-106",
  name: "Killer",
  printings: [
    {
      id: "OP10-106",
      artId: "OP10-106",
      setCode: "OP10",
      collectorNumber: "106",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-106.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 5000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "slash",
  effect:
    '[On K.O.] If your Leader has the "Supernovas" type, look at 3 cards from the top of your deck; reveal up to 1 "Supernovas" or "Kid Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
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
                  { filter: "trait", value: "Supernovas", match: "includes" },
                  { filter: "trait", value: "Kid Pirates", match: "includes" },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10Killer106I18n,
};
