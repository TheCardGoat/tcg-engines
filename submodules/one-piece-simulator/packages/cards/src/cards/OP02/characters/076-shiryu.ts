import type { CharacterCard } from "@tcg/op-types";
import { op02Shiryu076I18n } from "./076-shiryu.i18n.ts";

export const op02Shiryu076: CharacterCard = {
  id: "OP02-076",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "slash",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 1 or less.",
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
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02Shiryu076I18n,
};
