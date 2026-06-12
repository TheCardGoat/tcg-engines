import type { CharacterCard } from "@tcg/op-types";
import { op02Thatch007I18n } from "./007-thatch.i18n.ts";

export const op02Thatch007: CharacterCard = {
  id: "OP02-007",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP02",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op02Thatch007I18n,
};
