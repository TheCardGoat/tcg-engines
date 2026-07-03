import type { CharacterCard } from "@tcg/op-types";
import { op10Rock017I18n } from "./017-rock.i18n.ts";

export const op10Rock017: CharacterCard = {
  id: "OP10-017",
  canonicalId: "OP10-017",
  slug: "rock",
  name: "Rock",
  printings: [
    {
      id: "OP10-017",
      artId: "OP10-017",
      setCode: "OP10",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-017.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Punk Hazard"],
  attribute: "ranged",
  effect: "[On Play] If you don't have [Scotch], play up to 1 [Scotch] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Scotch",
              },
            ],
          },
        ],
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
                filter: "name",
                value: "Scotch",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op10Rock017I18n,
};
