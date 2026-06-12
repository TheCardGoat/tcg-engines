import type { CharacterCard } from "@tcg/op-types";
import { op02Jango100I18n } from "./100-jango.i18n.ts";

export const op02Jango100: CharacterCard = {
  id: "OP02-100",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect: "If you have [Fullbody], this Character cannot be K.O.'d in battle.",
  i18n: op02Jango100I18n,
};
