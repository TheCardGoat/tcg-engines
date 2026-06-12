import type { CharacterCard } from "@tcg/op-types";
import { op03Kalifa060I18n } from "./060-kalifa.i18n.ts";

export const op03Kalifa060: CharacterCard = {
  id: "OP03-060",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "wisdom",
  effect:
    "[When Attacking] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Draw 2 cards and trash 1 card from your hand.",
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
  i18n: op03Kalifa060I18n,
};
