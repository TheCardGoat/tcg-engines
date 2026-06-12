import type { CharacterCard } from "@tcg/op-types";
import { op01NicoRobin017I18n } from "./017-nico-robin.i18n.ts";

export const op01NicoRobin017: CharacterCard = {
  id: "OP01-017",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] K.O. up to 1 of your opponent's Characters with 3000 power or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01NicoRobin017I18n,
};
