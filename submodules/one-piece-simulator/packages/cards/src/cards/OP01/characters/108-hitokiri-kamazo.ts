import type { CharacterCard } from "@tcg/op-types";
import { op01HitokiriKamazo108I18n } from "./108-hitokiri-kamazo.i18n.ts";

export const op01HitokiriKamazo108: CharacterCard = {
  id: "OP01-108",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 5000,
  traits: ["Kid Pirates Supernovas SMILE"],
  attribute: "slash",
  effect:
    "[On K.O.] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck): K.O. up to 1 of your opponent's Characters with a cost of 5 or less.  This card has been officially errata'd.",
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
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01HitokiriKamazo108I18n,
};
