import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteBrulee066I18n } from "./066-charlotte-brulee.i18n.ts";

export const op08CharlotteBrulee066: CharacterCard = {
  id: "OP08-066",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 1000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
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
  i18n: op08CharlotteBrulee066I18n,
};
