import type { CharacterCard } from "@tcg/op-types";
import { op04Kuro023I18n } from "./023-kuro.i18n.ts";

export const op04Kuro023: CharacterCard = {
  id: "OP04-023",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["East Blue Black Cat Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op04Kuro023I18n,
};
