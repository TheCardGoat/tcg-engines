import type { CharacterCard } from "@tcg/op-types";
import { op06DouglasBullet010I18n } from "./010-douglas-bullet.i18n.ts";

export const op06DouglasBullet010: CharacterCard = {
  id: "OP06-010",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP06",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["FILM The Pirates Fest"],
  attribute: "strike",
  effect:
    'If your Leader has the "FILM" type, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)',
  i18n: op06DouglasBullet010I18n,
};
