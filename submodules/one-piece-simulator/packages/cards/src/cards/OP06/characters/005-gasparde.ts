import type { CharacterCard } from "@tcg/op-types";
import { op06Gasparde005I18n } from "./005-gasparde.i18n.ts";

export const op06Gasparde005: CharacterCard = {
  id: "OP06-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["FILM Former Navy Gasparde Pirates"],
  attribute: "special",
  i18n: op06Gasparde005I18n,
};
