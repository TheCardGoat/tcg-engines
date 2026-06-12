import type { CharacterCard } from "@tcg/op-types";
import { op12DouglasBullet010I18n } from "./010-douglas-bullet.i18n.ts";

export const op12DouglasBullet010: CharacterCard = {
  id: "OP12-010",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["FILM The Pirates Fest Former Roger Pirates"],
  attribute: "special",
  i18n: op12DouglasBullet010I18n,
};
