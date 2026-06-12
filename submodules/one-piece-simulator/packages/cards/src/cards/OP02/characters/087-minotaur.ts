import type { CharacterCard } from "@tcg/op-types";
import { op02Minotaur087I18n } from "./087-minotaur.i18n.ts";

export const op02Minotaur087: CharacterCard = {
  id: "OP02-087",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Impel Down Jailer Beast"],
  attribute: "strike",
  effect:
    "[Double Attack] (This card deals 2 damage.) [On K.O.] If your Leader has the [Impel Down] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op02Minotaur087I18n,
};
