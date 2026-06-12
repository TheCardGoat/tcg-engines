import type { CharacterCard } from "@tcg/op-types";
import { op03Nero087I18n } from "./087-nero.i18n.ts";

export const op03Nero087: CharacterCard = {
  id: "OP03-087",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["CP9"],
  attribute: "ranged",
  effect: "NULL",
  i18n: op03Nero087I18n,
};
