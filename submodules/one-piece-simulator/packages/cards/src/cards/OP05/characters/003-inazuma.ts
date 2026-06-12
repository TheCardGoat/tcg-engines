import type { CharacterCard } from "@tcg/op-types";
import { op05Inazuma003I18n } from "./003-inazuma.i18n.ts";

export const op05Inazuma003: CharacterCard = {
  id: "OP05-003",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "slash",
  effect:
    "If you have a Character with 7000 power or more other than this Character, this Character gains [Rush]. (This card can attack on the turn in which it is played.)",
  i18n: op05Inazuma003I18n,
};
