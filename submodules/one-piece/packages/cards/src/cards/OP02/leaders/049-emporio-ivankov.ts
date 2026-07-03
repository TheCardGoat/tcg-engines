import type { LeaderCard } from "@tcg/op-types";
import { op02EmporioIvankov049I18n } from "./049-emporio-ivankov.i18n.ts";

export const op02EmporioIvankov049: LeaderCard = {
  id: "OP02-049",
  canonicalId: "OP02-049",
  slug: "emporio-ivankov/op02-049",
  name: "Emporio.Ivankov",
  printings: [
    {
      id: "OP02-049",
      artId: "OP02-049",
      setCode: "OP02",
      collectorNumber: "049",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-049.jpg",
    },
    {
      id: "OP02-049_p1",
      artId: "OP02-049_p1",
      setCode: "OP02",
      collectorNumber: "049",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-049_p1.jpg",
    },
  ],
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP02",
  power: 5000,
  life: 5,
  traits: ["Revolutionary Army Impel Down"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-049_p1.jpg",
      imageId: "OP02-049_p1",
    },
  ],
  effect: "[End of Your Turn] If you have 0 cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "eq",
            value: 0,
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
  i18n: op02EmporioIvankov049I18n,
};
