import type { CharacterCard } from "@tcg/op-types";
import { op08Miyagi031I18n } from "./031-miyagi.i18n.ts";

export const op08Miyagi031: CharacterCard = {
  id: "OP08-031",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 1000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "wisdom",
  effect:
    "[On Play] Set up to 1 of your [Minks] type Characters with a cost of 2 or less as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Minks",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Miyagi031I18n,
};
