import type { CharacterCard } from "@tcg/op-types";
import { op10EdwardNewgateSp002I18n } from "./002-edward-newgate-sp.i18n.ts";

export const op10EdwardNewgateSp002: CharacterCard = {
  id: "ST15-002",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP10",
  cost: 7,
  power: 8000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[On Play] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.\n[Activate: Main] You may rest this Character: K.O. up to 1 of your opponent's Characters with 5000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 5000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10EdwardNewgateSp002I18n,
};
