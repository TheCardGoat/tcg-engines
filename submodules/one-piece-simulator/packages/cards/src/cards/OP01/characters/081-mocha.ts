import type { CharacterCard } from "@tcg/op-types";
import { op01Mocha081I18n } from "./081-mocha.i18n.ts";

export const op01Mocha081: CharacterCard = {
  id: "OP01-081",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Punk Hazard"],
  attribute: "strike",
  effect: "NULL",
  i18n: op01Mocha081I18n,
};
