import type { CharacterCard } from "@tcg/op-types";
import { op14eb04SenorPink065I18n } from "./065-senor-pink.i18n.ts";

export const op14eb04SenorPink065: CharacterCard = {
  id: "OP14-065",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect: "[On K.O.] Your opponent returns 1 DON!! card from their field to their DON!! deck.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "opponentReturnDon",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04SenorPink065I18n,
};
