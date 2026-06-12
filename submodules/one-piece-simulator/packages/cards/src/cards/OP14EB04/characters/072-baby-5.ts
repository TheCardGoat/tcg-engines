import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Baby5072I18n } from "./072-baby-5.i18n.ts";

export const op14eb04Baby5072: CharacterCard = {
  id: "OP14-072",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 4,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.\n[On K.O.] DON!! 1: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "onKo",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Baby5072I18n,
};
