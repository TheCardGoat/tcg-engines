import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Rindo115I18n } from "./115-rindo.i18n.ts";

export const op14eb04Rindo115: CharacterCard = {
  id: "OP14-115",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 5,
  power: 5000,
  counter: 1000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["Kuja Pirates"],
  attribute: "ranged",
  effect:
    "[Opponent's Turn] [On K.O.] Add up to 1 card from the top of your deck to the top of your Life cards. Then, you take 1 damage.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
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
  i18n: op14eb04Rindo115I18n,
};
