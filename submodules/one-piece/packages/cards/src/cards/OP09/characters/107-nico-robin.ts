import type { CharacterCard } from "@tcg/op-types";
import { op09NicoRobin107I18n } from "./107-nico-robin.i18n.ts";

export const op09NicoRobin107: CharacterCard = {
  id: "OP09-107",
  canonicalId: "OP09-107",
  slug: "nico-robin/op09-107",
  name: "Nico Robin",
  printings: [
    {
      id: "OP09-107",
      artId: "OP09-107",
      setCode: "OP09",
      collectorNumber: "107",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-107.jpg",
    },
    {
      id: "OP09-107_p1",
      artId: "OP09-107_p1",
      setCode: "OP09",
      collectorNumber: "107",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-107_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP09",
  cost: 6,
  power: 6000,
  counter: 1000,
  trigger: "Play up to 1 yellow Character card with a cost of 3 or less from your hand.",
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-107_p1.jpg",
      imageId: "OP09-107_p1",
    },
  ],
  effect:
    "[On Play] If your opponent has 3 or more Life cards, trash up to 1 card from the top of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
      },
      {
        trigger: "trigger",
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
                value: 3,
              },
              {
                filter: "color",
                value: "yellow",
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
  i18n: op09NicoRobin107I18n,
};
