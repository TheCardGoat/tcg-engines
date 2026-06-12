import type { CharacterCard } from "@tcg/op-types";
import { op07Aladine020I18n } from "./020-aladine.i18n.ts";

export const op07Aladine020: CharacterCard = {
  id: "OP07-020",
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
                filter: "trait",
                value: "Fish-Man",
              },
              {
                filter: "trait",
                value: "Merfolk",
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
