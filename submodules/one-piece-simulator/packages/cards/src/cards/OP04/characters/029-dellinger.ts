import type { CharacterCard } from "@tcg/op-types";
import { op04Dellinger029I18n } from "./029-dellinger.i18n.ts";

export const op04Dellinger029: CharacterCard = {
  id: "OP04-029",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
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
  i18n: op04Dellinger029I18n,
};
