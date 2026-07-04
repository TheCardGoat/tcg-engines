import type { CharacterCard } from "@tcg/op-types";
import { eb02Gaimon012I18n } from "./012-gaimon.i18n.ts";

export const eb02Gaimon012: CharacterCard = {
  id: "EB02-012",
  canonicalId: "EB02-012",
  slug: "gaimon/eb02-012",
  name: "Gaimon",
  printings: [
    {
      id: "EB02-012",
      artId: "EB02-012",
      setCode: "EB02",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-012.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB02",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect: "If you have a [Sarfunkel], this Character gains [Blocker].",
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
                filter: "name",
                value: "Sarfunkel",
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
  i18n: eb02Gaimon012I18n,
};
