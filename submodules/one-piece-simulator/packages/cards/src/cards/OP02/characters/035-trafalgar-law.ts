import type { CharacterCard } from "@tcg/op-types";
import { op02TrafalgarLaw035I18n } from "./035-trafalgar-law.i18n.ts";

export const op02TrafalgarLaw035: CharacterCard = {
  id: "OP02-035",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Film Heart Pirates Supernovas"],
  attribute: "slash",
  effect:
    "[Activate:Main] (1) (You may rest the specified number of DON!! cards in your cost area.) You may return this Character to the owner's hand: Play up to 1 Character with a cost of 3 from your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 3,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op02TrafalgarLaw035I18n,
};
