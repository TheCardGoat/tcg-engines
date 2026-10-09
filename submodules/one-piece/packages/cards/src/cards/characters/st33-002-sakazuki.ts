import type { CharacterCard } from "@tcg/op-types";
import { st33Sakazuki002I18n } from "./st33-002-sakazuki.i18n.ts";
export const st33Sakazuki002: CharacterCard = {
  id: "ST33-002",
  canonicalId: "ST33-002",
  slug: "sakazuki/st33-002",
  name: "Sakazuki",
  printings: [
    {
      id: "ST33-002",
      artId: "ST33-002",
      setCode: "ST33",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST33-002.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST33",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[When Attacking] You may trash 1 card from your hand: If your opponent has 6 or more cards in their hand, your opponent trashes 1 card from their hand. [On K.O.] Play up to 1 {Navy} type Character card with a cost of 4 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "opponent",
              comparison: "gte",
              value: 6,
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
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
                value: 4,
              },
              {
                filter: "trait",
                value: "Navy",
                match: "exact",
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
  i18n: st33Sakazuki002I18n,
};
