import type { CharacterCard } from "@tcg/op-types";
import { op10SenorPink067I18n } from "./067-senor-pink.i18n.ts";

export const op10SenorPink067: CharacterCard = {
  id: "OP10-067",
  canonicalId: "OP10-067",
  slug: "senor-pink/op10-067",
  name: "Senor Pink",
  printings: [
    {
      id: "OP10-067",
      artId: "OP10-067",
      setCode: "OP10",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-067.jpg",
    },
    {
      id: "OP10-067_p1",
      artId: "OP10-067_p1",
      setCode: "OP10",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-067_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP10",
  cost: 5,
  power: 6000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-067_p1.jpg",
      imageId: "OP10-067_p1",
    },
  ],
  effect:
    "[On Play] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Add up to 1 purple Event with a cost of 5 or less from your trash to your hand. Then, set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "purple",
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op10SenorPink067I18n,
};
