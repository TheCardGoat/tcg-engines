import type { CharacterCard } from "@tcg/op-types";
import { op16Antlerkov029I18n } from "./op16-029-antlerkov.i18n.ts";

export const op16Antlerkov029: CharacterCard = {
  id: "OP16-029",
  canonicalId: "OP16-029",
  slug: "antlerkov/op16-029",
  name: "Antlerkov",
  printings: [
    {
      id: "OP16-029",
      artId: "OP16-029",
      setCode: "OP16",
      collectorNumber: "029",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-029_zf65lRM.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP16",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Impel Down"],
  attribute: "ranged",
  effect:
    "[When Attacking] If you have [Bunkov], play up to 1 Character card with a cost of 2 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Bunkov",
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
                filter: "cost",
                comparison: "lte",
                value: 2,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op16Antlerkov029I18n,
};
