import type { CharacterCard } from "@tcg/op-types";
import { eb03BeloBetty056I18n } from "./056-belo-betty.i18n.ts";

export const eb03BeloBetty056: CharacterCard = {
  id: "EB03-056",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB03",
  cost: 4,
  power: 3000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] You may turn 1 card from the top of your Life cards face-up: K.O. up to 1 of your opponent's Characters with a base cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03BeloBetty056I18n,
};
