import type { CharacterCard } from "@tcg/op-types";
import { op12Baby5112I18n } from "./112-baby-5.i18n.ts";

export const op12Baby5112: CharacterCard = {
  id: "OP12-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger: "If your Leader is multicolored, draw 2 cards.",
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect: "[Trigger] If your Leader is multicolored, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op12Baby5112I18n,
};
