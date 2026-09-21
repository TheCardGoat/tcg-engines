import type { CharacterCard } from "@tcg/op-types";
import { op16Izo002I18n } from "./op16-002-izo.i18n.ts";

export const op16Izo002: CharacterCard = {
  id: "OP16-002",
  canonicalId: "OP16-002",
  slug: "izo/op16-002",
  name: "Izo",
  printings: [
    {
      id: "OP16-002",
      artId: "OP16-002",
      setCode: "OP16",
      collectorNumber: "002",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-002_kWtIkhz.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP16",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Land of Wano Whitebeard Pirates"],
  attribute: "ranged",
  effect: "[On Play] You may reveal 1 Character card with 8000 power from your hand: Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "revealFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "power",
                comparison: "eq",
                value: 8000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16Izo002I18n,
};
