import type { CharacterCard } from "@tcg/op-types";
import { op10ScratchmenApoo108I18n } from "./108-scratchmen-apoo.i18n.ts";

export const op10ScratchmenApoo108: CharacterCard = {
  id: "OP10-108",
  canonicalId: "OP10-108",
  slug: "scratchmen-apoo/op10-108",
  name: "Scratchmen Apoo",
  printings: [
    {
      id: "OP10-108",
      artId: "OP10-108",
      setCode: "OP10",
      collectorNumber: "108",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-108.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["On-Air Pirates Supernovas"],
  attribute: "ranged",
  effect:
    'If you have a yellow "Supernovas" type Character other than [Scratchmen Apoo], this Character gains [Blocker].',
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
                filter: "color",
                value: "yellow",
              },
              {
                filter: "trait",
                value: "Supernovas",
                match: "includes",
              },
              {
                filter: "excludeName",
                value: "Scratchmen Apoo",
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
  i18n: op10ScratchmenApoo108I18n,
};
