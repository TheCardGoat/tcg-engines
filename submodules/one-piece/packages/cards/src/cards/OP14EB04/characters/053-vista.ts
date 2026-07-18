import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Vista053I18n } from "./053-vista.i18n.ts";

export const op14eb04Vista053: CharacterCard = {
  id: "OP14-053",
  canonicalId: "OP14-053",
  slug: "vista/op14-053",
  name: "Vista",
  printings: [
    {
      id: "OP14-053",
      artId: "OP14-053",
      setCode: "OP14EB04",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-053_hqH99hz.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Blocker]\n[Opponent's Turn] If you have 7 or less cards in your hand, this Character's base power becomes the same as your Leader's base power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "setBasePowerFrom",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            source: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Vista053I18n,
};
