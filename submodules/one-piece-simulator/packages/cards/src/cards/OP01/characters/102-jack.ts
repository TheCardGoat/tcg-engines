import type { CharacterCard } from "@tcg/op-types";
import { op01Jack102I18n } from "./102-jack.i18n.ts";

export const op01Jack102: CharacterCard = {
  id: "OP01-102",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-102_p1.jpg",
      imageId: "OP01-102_p1",
    },
  ],
  effect:
    "[When Attacking] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Your opponent trashes 1 card from their hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op01Jack102I18n,
};
