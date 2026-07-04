import type { CharacterCard } from "@tcg/op-types";
import { op08Carrot023I18n } from "./023-carrot.i18n.ts";

export const op08Carrot023: CharacterCard = {
  id: "OP08-023",
  canonicalId: "OP08-023",
  slug: "carrot/op08-023",
  name: "Carrot",
  printings: [
    {
      id: "OP08-023",
      artId: "OP08-023",
      setCode: "OP08",
      collectorNumber: "023",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-023.jpg",
    },
    {
      id: "OP08-023_p1",
      artId: "OP08-023_p1",
      setCode: "OP08",
      collectorNumber: "023",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-023_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-023_p1.jpg",
      imageId: "OP08-023_p1",
    },
  ],
  effect:
    "[On Play]/[When Attacking] Up to 1 of your opponent's rested Characters with a cost of 7 or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 7,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Carrot023I18n,
};
