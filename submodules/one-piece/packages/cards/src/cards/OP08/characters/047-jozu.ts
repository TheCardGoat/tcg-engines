import type { CharacterCard } from "@tcg/op-types";
import { op08Jozu047I18n } from "./047-jozu.i18n.ts";

export const op08Jozu047: CharacterCard = {
  id: "OP08-047",
  canonicalId: "OP08-047",
  slug: "jozu/op08-047",
  name: "Jozu",
  printings: [
    {
      id: "OP08-047",
      artId: "OP08-047",
      setCode: "OP08",
      collectorNumber: "047",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-047.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP08",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    "[On Play] You may return 1 of your Characters other than this Character to the owner's hand: Return up to 1 Character with a cost of 6 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnCharacter",
            amount: 1,
            filters: [
              {
                filter: "excludeSelf",
              },
            ],
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "any",
              zones: ["character"],
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
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op08Jozu047I18n,
};
