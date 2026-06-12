import type { CharacterCard } from "@tcg/op-types";
import { op05Hack012I18n } from "./012-hack.i18n.ts";

export const op05Hack012: CharacterCard = {
  id: "OP05-012",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man Revolutionary Army"],
  attribute: "strike",
  effect: "NULL",
  i18n: op05Hack012I18n,
};
