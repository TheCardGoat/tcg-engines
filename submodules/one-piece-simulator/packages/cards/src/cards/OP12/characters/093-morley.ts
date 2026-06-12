import type { CharacterCard } from "@tcg/op-types";
import { op12Morley093I18n } from "./093-morley.i18n.ts";

export const op12Morley093: CharacterCard = {
  id: "OP12-093",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Giant Revolutionary Army"],
  attribute: "special",
  effect: 'If your Leader has the "Revolutionary Army" type, this Character gains +4 cost.',
  i18n: op12Morley093I18n,
};
