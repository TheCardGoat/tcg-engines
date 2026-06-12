import type { CharacterCard } from "@tcg/op-types";
import { op04Baby5032I18n } from "./032-baby-5.i18n.ts";

export const op04Baby5032: CharacterCard = {
  id: "OP04-032",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP04",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[End of Your Turn] You may trash this Character: Set up to 2 of your DON!! cards as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Baby5032I18n,
};
