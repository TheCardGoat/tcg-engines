import type { CharacterCard } from "@tcg/op-types";
import { op01TrafalgarLaw047I18n } from "./047-trafalgar-law.i18n.ts";

export const op01TrafalgarLaw047: CharacterCard = {
  id: "OP01-047",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP01",
  cost: 5,
  power: 6000,
  traits: ["Heart Pirates Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-047_p1.jpg",
      imageId: "OP01-047_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] You may return 1 Character to your hand: Play up to 1 Character card with a cost of 3 or less from your hand.  This card has been officially errata'd.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
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
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01TrafalgarLaw047I18n,
};
