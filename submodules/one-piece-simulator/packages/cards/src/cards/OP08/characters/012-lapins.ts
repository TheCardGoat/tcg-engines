import type { CharacterCard } from "@tcg/op-types";
import { op08Lapins012I18n } from "./012-lapins.i18n.ts";

export const op08Lapins012: CharacterCard = {
  id: "OP08-012",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP08",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Animal Drum Kingdom"],
  attribute: "strike",
  effect:
    "[DON!! x2] [When Attacking] If your Leader has the [Drum Kingdom] type, K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "leaderTrait",
            trait: "Drum Kingdom",
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
                  value: 4000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Lapins012I18n,
};
