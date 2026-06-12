import type { CharacterCard } from "@tcg/op-types";
import { op01JeanBart045I18n } from "./045-jean-bart.i18n.ts";

export const op01JeanBart045: CharacterCard = {
  id: "OP01-045",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "strike",
  effect: "NULL",
  i18n: op01JeanBart045I18n,
};
