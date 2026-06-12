import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Cavendish004I18n } from "./004-cavendish.i18n.ts";

export const op14eb04Cavendish004: CharacterCard = {
  id: "OP14-004",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Beautiful Pirates Supernovas Dressrosa"],
  attribute: "slash",
  effect:
    "If this Character has 5000 power or more, this Character gains [Rush].\n(This card can attack on the turn in which it is played.)",
  i18n: op14eb04Cavendish004I18n,
};
