import type { CharacterCard } from "@tcg/op-types";
import { prb02Shiryu015I18n } from "./015-shiryu.i18n.ts";

export const prb02Shiryu015: CharacterCard = {
  id: "PRB02-015",
  canonicalId: "PRB02-015",
  slug: "shiryu/prb02-015",
  name: "Shiryu",
  printings: [
    {
      id: "PRB02-015",
      artId: "PRB02-015",
      setCode: "PRB02",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-015.jpg",
    },
    {
      id: "PRB02-015_p1",
      artId: "PRB02-015_p1",
      setCode: "PRB02",
      collectorNumber: "015",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-015_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-015_p1.jpg",
      imageId: "PRB02-015_p1",
    },
  ],
  effect:
    'If your Leader has the "Blackbeard Pirates" type, this Character gains [Blocker] and +4 cost.[On K.O.] If your Leader has the "Blackbeard Pirates" type, K.O. up to 1 of your opponent\'s Characters with a base cost of 4 or less.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 4,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: prb02Shiryu015I18n,
};
