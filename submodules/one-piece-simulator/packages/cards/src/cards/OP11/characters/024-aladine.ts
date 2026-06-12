import type { CharacterCard } from "@tcg/op-types";
import { op11Aladine024I18n } from "./024-aladine.i18n.ts";

export const op11Aladine024: CharacterCard = {
  id: "OP11-024",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Sun Pirates Merfolk Fish-Man Island"],
  attribute: "slash",
  effect:
    'When this Character is K.O.\'d by your opponent\'s effect, you may trash 1 card from your hand and rest 1 of your DON!! cards. If you do, play up to 1 "Fish-Man" or "Merfolk" type Character card with a cost of 6 or less from your hand.',
  i18n: op11Aladine024I18n,
};
