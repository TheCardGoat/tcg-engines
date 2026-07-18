import type { CharacterCard } from "@tcg/op-types";
import { op09Buggy051I18n } from "./051-buggy.i18n.ts";

export const op09Buggy051: CharacterCard = {
  id: "OP09-051",
  canonicalId: "OP09-051",
  slug: "buggy/op09-051",
  name: "Buggy",
  printings: [
    {
      id: "OP09-051",
      artId: "OP09-051",
      setCode: "OP09",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051.jpg",
    },
    {
      id: "OP09-051_p3",
      artId: "OP09-051_p3",
      setCode: "OP09",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p3.jpg",
    },
    {
      id: "OP09-051_p1",
      artId: "OP09-051_p1",
      setCode: "OP09",
      collectorNumber: "051",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP09",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Cross Guild"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p3.jpg",
      imageId: "OP09-051_p3",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-051_p1.jpg",
      imageId: "OP09-051_p1",
    },
  ],
  effect:
    "[On Play] Place up to 1 of your opponent's Characters at the bottom of the owner's deck. Then, if you do not have 5 Characters with a cost of 5 or more, place this Character at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "bottom",
          },
          {
            action: "returnToDeck",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            position: "bottom",
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "lt",
              value: 5,
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op09Buggy051I18n,
};
