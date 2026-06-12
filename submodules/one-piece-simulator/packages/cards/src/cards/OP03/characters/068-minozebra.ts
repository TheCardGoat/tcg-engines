import type { CharacterCard } from "@tcg/op-types";
import { op03Minozebra068I18n } from "./068-minozebra.i18n.ts";

export const op03Minozebra068: CharacterCard = {
  id: "OP03-068",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Impel Down Jailer Beast"],
  attribute: "strike",
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.) [On K.O.] If your Leader has the [Impel Down] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["banish"],
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
  i18n: op03Minozebra068I18n,
};
