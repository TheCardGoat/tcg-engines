import type { CharacterCard } from "@tcg/op-types";
import { op02EmporioIvankov051I18n } from "./051-emporio-ivankov.i18n.ts";

export const op02EmporioIvankov051: CharacterCard = {
  id: "OP02-051",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP02",
  cost: 7,
  power: 7000,
  traits: ["Revolutionary Army Impel Down"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-051_p1.jpg",
      imageId: "OP02-051_p1",
    },
  ],
  effect:
    "[On Play] Draw card(s) so that you have 3 cards in your hand and then play up to 1 blue [Impel Down] type Character card with a cost of 6 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 3,
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
                comparison: "lte",
                value: 6,
              },
              {
                filter: "color",
                value: "blue",
              },
              {
                filter: "trait",
                value: "Impel Down",
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
  i18n: op02EmporioIvankov051I18n,
};
