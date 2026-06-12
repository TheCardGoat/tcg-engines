import type { CharacterCard } from "@tcg/op-types";
import { eb03Baby5036I18n } from "./036-baby-5.i18n.ts";

export const eb03Baby5036: CharacterCard = {
  id: "EB03-036",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB03",
  cost: 4,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Play] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 2 of your opponent's Characters with a base cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
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
                amount: 2,
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
      },
    ],
  },
  i18n: eb03Baby5036I18n,
};
