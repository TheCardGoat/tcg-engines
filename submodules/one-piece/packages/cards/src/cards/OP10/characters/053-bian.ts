import type { CharacterCard } from "@tcg/op-types";
import { op10Bian053I18n } from "./053-bian.i18n.ts";

export const op10Bian053: CharacterCard = {
  id: "OP10-053",
  canonicalId: "OP10-053",
  slug: "bian",
  name: "Bian",
  printings: [
    {
      id: "OP10-053",
      artId: "OP10-053",
      setCode: "OP10",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-053.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Dressrosa The Tontattas"],
  attribute: "slash",
  effect:
    'If you have a "The Tontattas" type Character other than [Bian], this Character gains [Blocker].',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "The Tontattas",
                match: "includes",
              },
              {
                filter: "excludeName",
                value: "Bian",
              },
            ],
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
        ],
      },
    ],
  },
  i18n: op10Bian053I18n,
};
