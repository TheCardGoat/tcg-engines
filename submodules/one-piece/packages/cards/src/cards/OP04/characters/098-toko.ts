import type { CharacterCard } from "@tcg/op-types";
import { op04Toko098I18n } from "./098-toko.i18n.ts";

export const op04Toko098: CharacterCard = {
  id: "OP04-098",
  canonicalId: "OP04-098",
  slug: "toko",
  name: "Toko",
  printings: [
    {
      id: "OP04-098",
      artId: "OP04-098",
      setCode: "OP04",
      collectorNumber: "098",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-098.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP04",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "wisdom",
  effect:
    "[On Play] You may trash 2 [Land of Wano] type cards from your hand: If you have 1 or less Life cards, add 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
            filters: [
              {
                filter: "trait",
                value: "Land of Wano",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
              },
            },
            position: "top",
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 1,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Toko098I18n,
};
