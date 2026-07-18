import type { CharacterCard } from "@tcg/op-types";
import { op07Aladine020I18n } from "./020-aladine.i18n.ts";

export const op07Aladine020: CharacterCard = {
  id: "OP07-020",
  canonicalId: "OP07-020",
  slug: "aladine/op07-020",
  name: "Aladine",
  printings: [
    {
      id: "OP07-020",
      artId: "OP07-020",
      setCode: "OP07",
      collectorNumber: "020",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-020.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 5,
  power: 6000,
  traits: ["The Sun Pirates Merfolk"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] If your Leader has the [Fish-Man] type, play up to 1 [Fish-Man] or [Merfolk] type Character card with a cost of 3 or less from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Fish-Man",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 3,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Fish-Man",
                    match: "includes",
                  },
                  {
                    filter: "trait",
                    value: "Merfolk",
                    match: "includes",
                  },
                ],
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op07Aladine020I18n,
};
