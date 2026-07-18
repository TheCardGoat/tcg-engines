import type { CharacterCard } from "@tcg/op-types";
import { op12Ipponmatsu021I18n } from "./021-ipponmatsu.i18n.ts";

export const op12Ipponmatsu021: CharacterCard = {
  id: "OP12-021",
  canonicalId: "OP12-021",
  slug: "ipponmatsu/op12-021",
  name: "Ipponmatsu",
  printings: [
    {
      id: "OP12-021",
      artId: "OP12-021",
      setCode: "OP12",
      collectorNumber: "021",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-021_PoXGOE4.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "If your Leader has the (Slash) attribute and you have 6 or more rested DON!! cards, this Character cannot be rested by your opponent's effects.[Blocker]",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderAttribute",
                attribute: "slash",
              },
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 6,
                state: "rested",
              },
            ],
          },
        ],
        actions: [
          {
            action: "cannotBeRested",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            byPlayer: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op12Ipponmatsu021I18n,
};
