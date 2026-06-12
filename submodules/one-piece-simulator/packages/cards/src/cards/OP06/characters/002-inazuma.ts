import type { CharacterCard } from "@tcg/op-types";
import { op06Inazuma002I18n } from "./002-inazuma.i18n.ts";

export const op06Inazuma002: CharacterCard = {
  id: "OP06-002",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "slash",
  effect:
    "If this Character has 7000 power or more, this Character gains [Banish].\n(When this card deals damage, the target card is trashed without activating its Trigger.)",
  i18n: op06Inazuma002I18n,
};
