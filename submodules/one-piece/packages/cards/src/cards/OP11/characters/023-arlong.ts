import type { CharacterCard } from "@tcg/op-types";
import { op11Arlong023I18n } from "./023-arlong.i18n.ts";

export const op11Arlong023: CharacterCard = {
  id: "OP11-023",
  canonicalId: "OP11-023",
  slug: "arlong/op11-023",
  name: "Arlong",
  printings: [
    {
      id: "OP11-023",
      artId: "OP11-023",
      setCode: "OP11",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-023.jpg",
    },
    {
      id: "OP11-023_p1",
      artId: "OP11-023_p1",
      setCode: "OP11",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-023_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP11",
  cost: 7,
  power: 7000,
  counter: 1000,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Fish-Man The Sun Pirates Fish-Man Island"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-023_p1.jpg",
      imageId: "OP11-023_p1",
    },
  ],
  effect:
    'If your Leader has the "Fish-Man" type, you have 3 or less Life cards and your opponent has 5 or more rested cards, give this card in your hand 3 cost.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 4 }],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Fish-Man",
                match: "includes",
              },
              {
                condition: "lifeCount",
                player: "self",
                comparison: "lte",
                value: 3,
              },
              {
                condition: "restedCardCount",
                player: "opponent",
                comparison: "gte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "setCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: { amount: 1 },
              self: true,
            },
            value: 3,
          },
        ],
      },
    ],
  },
  i18n: op11Arlong023I18n,
};
