import type { CharacterCard } from "@tcg/op-types";
import { op07Pappag030I18n } from "./030-pappag.i18n.ts";

export const op07Pappag030: CharacterCard = {
  id: "OP07-030",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Animal"],
  attribute: "wisdom",
  effect:
    "If you have a [Camie] Character, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op07Pappag030I18n,
};
