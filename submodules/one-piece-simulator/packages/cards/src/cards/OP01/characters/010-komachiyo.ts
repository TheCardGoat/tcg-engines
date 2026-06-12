import type { CharacterCard } from "@tcg/op-types";
import { op01Komachiyo010I18n } from "./010-komachiyo.i18n.ts";

export const op01Komachiyo010: CharacterCard = {
  id: "OP01-010",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Animal Land of Wano"],
  attribute: "strike",
  effect: "NULL",
  i18n: op01Komachiyo010I18n,
};
