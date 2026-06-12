import type { CharacterCard } from "@tcg/op-types";
import { prb01TrafalgarLaw047I18n } from "./047-trafalgar-law.i18n.ts";

export const prb01TrafalgarLaw047: CharacterCard = {
  id: "OP01-047",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB01",
  cost: 5,
  power: 6000,
  traits: ["Supernovas", "Heart Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-047_p4.jpg",
      imageId: "OP01-047_p4",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] You may return 1 of your Characters to the owner's hand: Play up to 1 Character card with a cost of 3 or less from your hand.",
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
  i18n: prb01TrafalgarLaw047I18n,
};
