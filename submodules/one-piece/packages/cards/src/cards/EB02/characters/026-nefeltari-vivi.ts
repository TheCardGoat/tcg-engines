import type { CharacterCard } from "@tcg/op-types";
import { eb02NefeltariVivi026I18n } from "./026-nefeltari-vivi.i18n.ts";

export const eb02NefeltariVivi026: CharacterCard = {
  id: "EB02-026",
  canonicalId: "EB02-026",
  slug: "nefeltari-vivi/eb02-026",
  name: "Nefeltari Vivi",
  printings: [
    {
      id: "EB02-026",
      artId: "EB02-026",
      setCode: "EB02",
      collectorNumber: "026",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-026.jpg",
    },
    {
      id: "EB02-026_p1",
      artId: "EB02-026_p1",
      setCode: "EB02",
      collectorNumber: "026",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-026_p1.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "EB02",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-026_p1.png",
      imageId: "EB02-026_p1",
    },
  ],
  effect:
    "[On Play] If your Leader is multicolored and you have 5 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderMulticolored",
              },
              {
                condition: "handCount",
                player: "self",
                comparison: "lte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: eb02NefeltariVivi026I18n,
};
