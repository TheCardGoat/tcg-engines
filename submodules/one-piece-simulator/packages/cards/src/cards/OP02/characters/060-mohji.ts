import type { CharacterCard } from "@tcg/op-types";
import { op02Mohji060I18n } from "./060-mohji.i18n.ts";

export const op02Mohji060: CharacterCard = {
  id: "OP02-060",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Buggy Pirates"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op02Mohji060I18n,
};
