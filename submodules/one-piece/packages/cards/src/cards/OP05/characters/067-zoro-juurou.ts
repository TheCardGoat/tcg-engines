import type { CharacterCard } from "@tcg/op-types";
import { op05ZoroJuurou067I18n } from "./067-zoro-juurou.i18n.ts";

export const op05ZoroJuurou067: CharacterCard = {
  id: "OP05-067",
  canonicalId: "OP05-067",
  slug: "zoro-juurou",
  name: "Zoro-Juurou",
  printings: [
    {
      id: "OP05-067",
      artId: "OP05-067",
      setCode: "OP05",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-067.jpg",
    },
    {
      id: "OP05-067_p1",
      artId: "OP05-067_p1",
      setCode: "OP05",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-067_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-067_p1.jpg",
      imageId: "OP05-067_p1",
    },
  ],
  effect:
    "[When Attacking] If you have 3 or less Life cards, add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op05ZoroJuurou067I18n,
};
