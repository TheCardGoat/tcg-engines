import type { CharacterCard } from "@tcg/op-types";
import { op11XDrake017I18n } from "./017-x-drake.i18n.ts";

export const op11XDrake017: CharacterCard = {
  id: "OP11-017",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP11",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Drake Pirates Navy SWORD"],
  attribute: "slash",
  i18n: op11XDrake017I18n,
};
