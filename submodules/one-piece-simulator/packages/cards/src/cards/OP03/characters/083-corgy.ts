import type { CharacterCard } from "@tcg/op-types";
import { op03Corgy083I18n } from "./083-corgy.i18n.ts";

export const op03Corgy083: CharacterCard = {
  id: "OP03-083",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["World Government"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck and trash up to 2 cards. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op03Corgy083I18n,
};
