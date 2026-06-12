import type { CharacterCard } from "@tcg/op-types";
import { op04MagellanSp085I18n } from "./085-magellan-sp.i18n.ts";

export const op04MagellanSp085: CharacterCard = {
  id: "OP02-085",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP04",
  cost: 5,
  power: 6000,
  traits: ["Impel Down"],
  attribute: "special",
  effect:
    "[On Play] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Your opponent returns 1 DON!! card from their field to their DON!! deck. [Opponent's Turn] When this Character is K.O.'d, your opponent returns 2 DON!! cards from their field to their DON!! deck.",
  effects: {
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
            action: "opponentReturnDon",
            amount: 1,
          },
        ],
      },
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
            action: "opponentReturnDon",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op04MagellanSp085I18n,
};
