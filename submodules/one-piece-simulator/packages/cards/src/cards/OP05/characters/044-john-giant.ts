import type { CharacterCard } from "@tcg/op-types";
import { op05JohnGiant044I18n } from "./044-john-giant.i18n.ts";

export const op05JohnGiant044: CharacterCard = {
  id: "OP05-044",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP05",
  cost: 8,
  power: 10000,
  counter: 1000,
  traits: ["Giant Navy"],
  attribute: "slash",
  effect: "NULL",
  i18n: op05JohnGiant044I18n,
};
