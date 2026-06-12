import type { CharacterCard } from "@tcg/op-types";
import { op01Krieg066I18n } from "./066-krieg.i18n.ts";

export const op01Krieg066: CharacterCard = {
  id: "OP01-066",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Krieg Pirates"],
  attribute: "slash",
  effect: "NULL",
  i18n: op01Krieg066I18n,
};
