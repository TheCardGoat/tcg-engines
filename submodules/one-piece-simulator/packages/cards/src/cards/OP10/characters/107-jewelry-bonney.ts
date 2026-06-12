import type { CharacterCard } from "@tcg/op-types";
import { op10JewelryBonney107I18n } from "./107-jewelry-bonney.i18n.ts";

export const op10JewelryBonney107: CharacterCard = {
  id: "OP10-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Bonney Pirates Supernovas"],
  attribute: "special",
  effect:
    '[Blocker]\n[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 "Supernovas" type Character card with a cost of 5 from your hand to the top of your Life cards face-up.',
  effects: {
    keywords: ["blocker"],
  },
  i18n: op10JewelryBonney107I18n,
};
