import type { CharacterCard } from "@tcg/op-types";
import { op02Magellan085I18n } from "./085-magellan.i18n.ts";

export const op02Magellan085: CharacterCard = {
  id: "OP02-085",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP02",
  cost: 5,
  power: 6000,
  traits: ["Impel Down"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-085_p1.jpg",
      imageId: "OP02-085_p1",
    },
  ],
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
  i18n: op02Magellan085I18n,
};
