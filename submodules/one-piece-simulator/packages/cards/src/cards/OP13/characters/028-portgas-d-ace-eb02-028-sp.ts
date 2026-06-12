import type { CharacterCard } from "@tcg/op-types";
import { op13PortgasDAceEb02028Sp028I18n } from "./028-portgas-d-ace-eb02-028-sp.i18n.ts";

export const op13PortgasDAceEb02028Sp028: CharacterCard = {
  id: "EB02-028",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP13",
  cost: 5,
  power: 5000,
  counter: 1000,
  traits: ["Alabasta Whitebeard Pirates"],
  attribute: "special",
  effect:
    '[On Play] If your Leader\'s type includes "Whitebeard Pirates", look at 5 cards from the top of your deck; reveal up to 1 Character card with a cost of 2 and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 Character card with a cost of 2 from your hand rested.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
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
                filter: "cost",
                comparison: "eq",
                value: 2,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
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
                comparison: "eq",
                value: 2,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13PortgasDAceEb02028Sp028I18n,
};
