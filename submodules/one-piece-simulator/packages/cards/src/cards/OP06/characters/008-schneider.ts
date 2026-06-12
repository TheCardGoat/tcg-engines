import type { CharacterCard } from "@tcg/op-types";
import { op06Schneider008I18n } from "./008-schneider.i18n.ts";

export const op06Schneider008: CharacterCard = {
  id: "OP06-008",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["FILM Mugiwara Chase"],
  attribute: "wisdom",
  i18n: op06Schneider008I18n,
};
