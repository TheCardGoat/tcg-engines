import type { CharacterCard } from "@tcg/op-types";
import { op07TrafalgarLawTr010I18n } from "./010-trafalgar-law-tr.i18n.ts";

export const op07TrafalgarLawTr010: CharacterCard = {
  id: "ST10-010",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your opponent has 7 or more cards in their hand, trash 2 cards from your opponent's hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "handCount",
            player: "opponent",
            comparison: "gte",
            value: 7,
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op07TrafalgarLawTr010I18n,
};
