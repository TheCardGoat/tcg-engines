import type { CharacterCard } from "@tcg/op-types";
import { op01Jinbe014I18n } from "./014-jinbe.i18n.ts";

export const op01Jinbe014: CharacterCard = {
  id: "OP01-014",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 4,
  power: 5000,
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [DON!! x1] [On Block] Play up to 1 red Character card with a cost of 2 or less from your hand.  This card has been officially errata'd.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
                value: 2,
              },
              {
                filter: "color",
                value: "red",
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
  i18n: op01Jinbe014I18n,
};
