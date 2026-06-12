import type { CharacterCard } from "@tcg/op-types";
import { op12Shiki005I18n } from "./005-shiki.i18n.ts";

export const op12Shiki005: CharacterCard = {
  id: "OP12-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["FILM Golden Lion Pirates"],
  attribute: "slash",
  i18n: op12Shiki005I18n,
};
