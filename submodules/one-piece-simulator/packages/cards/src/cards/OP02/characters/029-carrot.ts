import type { CharacterCard } from "@tcg/op-types";
import { op02Carrot029I18n } from "./029-carrot.i18n.ts";

export const op02Carrot029: CharacterCard = {
  id: "OP02-029",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP02",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Minks"],
  attribute: "special",
  effect: "[End of Your Turn] Set up to 1 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
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
  i18n: op02Carrot029I18n,
};
