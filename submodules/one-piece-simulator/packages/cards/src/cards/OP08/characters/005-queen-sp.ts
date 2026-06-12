import type { CharacterCard } from "@tcg/op-types";
import { op08QueenSp005I18n } from "./005-queen-sp.i18n.ts";

export const op08QueenSp005: CharacterCard = {
  id: "ST04-005",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op08QueenSp005I18n,
};
