import type { CharacterCard } from "@tcg/op-types";
import { op02Atmos003I18n } from "./003-atmos.i18n.ts";

export const op02Atmos003: CharacterCard = {
  id: "OP02-003",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op02Atmos003I18n,
};
