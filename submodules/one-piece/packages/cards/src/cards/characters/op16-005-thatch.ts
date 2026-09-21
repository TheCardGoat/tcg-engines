import type { CharacterCard } from "@tcg/op-types";
import { op16Thatch005I18n } from "./op16-005-thatch.i18n.ts";

export const op16Thatch005: CharacterCard = {
  id: "OP16-005",
  canonicalId: "OP16-005",
  slug: "thatch/op16-005",
  name: "Thatch",
  printings: [
    {
      id: "OP16-005",
      artId: "OP16-005",
      setCode: "OP16",
      collectorNumber: "005",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-005_edjwiya.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP16",
  cost: 8,
  power: 8000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    'If you have a Character with 8000 power or more and a type including "Whitebeard Pirates" give this card in your hand -3 cost.\n\n[Blocker]',
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 1,
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 8000,
              },
              {
                filter: "trait",
                value: "Whitebeard Pirates",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand", "character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: -3,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op16Thatch005I18n,
};
