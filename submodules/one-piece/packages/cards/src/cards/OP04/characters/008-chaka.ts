import type { CharacterCard } from "@tcg/op-types";
import { op04Chaka008I18n } from "./008-chaka.i18n.ts";

export const op04Chaka008: CharacterCard = {
  id: "OP04-008",
  canonicalId: "OP04-008",
  slug: "chaka/op04-008",
  name: "Chaka",
  printings: [
    {
      id: "OP04-008",
      artId: "OP04-008",
      setCode: "OP04",
      collectorNumber: "008",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-008.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP04",
  cost: 3,
  power: 5000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] If your Leader is [Nefeltari Vivi], give up to 1 of your opponent's Characters -3000 power during this turn. Then, K.O. up to 1 of your opponent's Characters with 0 power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "leaderName",
            name: "Nefeltari Vivi",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
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
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op04Chaka008I18n,
};
