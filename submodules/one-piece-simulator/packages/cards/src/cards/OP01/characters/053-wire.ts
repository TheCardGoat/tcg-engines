import type { CharacterCard } from "@tcg/op-types";
import { op01Wire053I18n } from "./053-wire.i18n.ts";

export const op01Wire053: CharacterCard = {
  id: "OP01-053",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op01Wire053I18n,
};
