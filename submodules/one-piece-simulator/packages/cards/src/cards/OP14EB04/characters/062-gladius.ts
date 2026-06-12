import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Gladius062I18n } from "./062-gladius.i18n.ts";

export const op14eb04Gladius062: CharacterCard = {
  id: "OP14-062",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On K.O.] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. or rest up to 1 of your opponent's Characters with a base power of 6000 or less.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
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
                        filter: "basePower",
                        comparison: "lte",
                        value: 6000,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "rest",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "basePower",
                        comparison: "lte",
                        value: 6000,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04Gladius062I18n,
};
