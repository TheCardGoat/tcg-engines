import type { CharacterCard } from "@tcg/op-types";
import { op01Mr2BonKureiBentham084I18n } from "./084-mr-2-bon-kurei-bentham.i18n.ts";

export const op01Mr2BonKureiBentham084: CharacterCard = {
  id: "OP01-084",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[DON!! x1] [When Attacking] Look at 5 cards from the top of your deck; reveal up to 1 "Baroque Works" type Event card and add it to your hand. Then, place the rest at the bottom of your deck in any order.  This card has been officially errata\'d.',
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
                value: "Baroque Works",
              },
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op01Mr2BonKureiBentham084I18n,
};
