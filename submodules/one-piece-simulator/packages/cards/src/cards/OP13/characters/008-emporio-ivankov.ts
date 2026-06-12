import type { CharacterCard } from "@tcg/op-types";
import { op13EmporioIvankov008I18n } from "./008-emporio-ivankov.i18n.ts";

export const op13EmporioIvankov008: CharacterCard = {
  id: "OP13-008",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "If your \"Revolutionary Army\" type Character would be K.O.'d by your opponent's effect, you may trash this Character instead.",
  i18n: op13EmporioIvankov008I18n,
};
