import type { CharacterCard } from "@tcg/op-types";
import { op11Pedro057I18n } from "./057-pedro.i18n.ts";

export const op11Pedro057: CharacterCard = {
  id: "OP11-057",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "If you have 4 or less cards in your hand, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op11Pedro057I18n,
};
