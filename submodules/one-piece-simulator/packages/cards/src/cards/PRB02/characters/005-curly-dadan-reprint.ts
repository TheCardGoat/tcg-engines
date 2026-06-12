import type { CharacterCard } from "@tcg/op-types";
import { prb02CurlyDadanReprint005I18n } from "./005-curly-dadan-reprint.i18n.ts";

export const prb02CurlyDadanReprint005: CharacterCard = {
  id: "OP02-005",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB02",
  cost: 2,
  power: 3000,
  traits: ["Mountain Bandits Mountain Bandits"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-005_p1.jpg",
      imageId: "OP02-005_p1",
    },
  ],
  effect:
    '[On Play] Look at up to 5 cards from the top of your deck; reveal up to 1 red Character with a cost of 1 and add it to your hand. Then, place the rest at the bottom of your deck in any order.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright) and the Artist Credit (Note: there is no pencil design on top of the artist name).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                value: 1,
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
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02CurlyDadanReprint005I18n,
};
