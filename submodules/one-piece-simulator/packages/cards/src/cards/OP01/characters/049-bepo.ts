import type { CharacterCard } from "@tcg/op-types";
import { op01Bepo049I18n } from "./049-bepo.i18n.ts";

export const op01Bepo049: CharacterCard = {
  id: "OP01-049",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP01",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Heart Pirates Minks"],
  attribute: "strike",
  effect:
    '[DON!! x1] [When Attacking] Play up to 1 "Heart Pirates" type card other than [Bepo] with a cost of 4 or less from your hand.  This card has been officially errata\'d.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
                filter: "excludeName",
                value: "Bepo",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Heart Pirates",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op01Bepo049I18n,
};
