import type { CharacterCard } from "@tcg/op-types";
import { op07Dice007I18n } from "./007-dice.i18n.ts";

export const op07Dice007: CharacterCard = {
  id: "OP07-007",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["FILM Grantesoro"],
  attribute: "strike",
  effect: "NULL",
  i18n: op07Dice007I18n,
};
