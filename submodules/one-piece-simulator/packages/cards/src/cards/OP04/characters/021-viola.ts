import type { CharacterCard } from "@tcg/op-types";
import { op04Viola021I18n } from "./021-viola.i18n.ts";

export const op04Viola021: CharacterCard = {
  id: "OP04-021",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Your Opponent's Attack] (2) (You may rest the specified number of DON!! cards in your cost area.): Rest up to 1 of your opponent's DON!! cards.",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op04Viola021I18n,
};
