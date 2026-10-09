import type { CharacterCard } from "@tcg/op-types";
import { pShanks104I18n } from "./p-104-shanks.i18n.ts";
export const pShanks104: CharacterCard = {
  id: "P-104",
  canonicalId: "P-104",
  slug: "shanks/p-104",
  name: "Shanks",
  printings: [
    {
      id: "P-104",
      artId: "P-104",
      setCode: "P",
      collectorNumber: "104",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-104.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 8,
  power: 10000,
  traits: ["The Four Emperors", "Red-Haired Pirates", "Former Roger Pirates"],
  attribute: "slash",
  effect:
    "If either you or your opponent has 10 DON!! cards on the field, this Character cannot be removed from the field by your opponent's effects.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "eq",
                value: 10,
              },
              {
                condition: "donFieldCount",
                player: "opponent",
                comparison: "eq",
                value: 10,
              },
            ],
          },
        ],
        actions: [
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            bySource: "opponentEffect",
          },
        ],
      },
    ],
  },
  i18n: pShanks104I18n,
};
