import type { CharacterCard } from "@tcg/op-types";
import { op12JaguarDSaul050I18n } from "./050-jaguar-d-saul.i18n.ts";

export const op12JaguarDSaul050: CharacterCard = {
  id: "OP12-050",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP12",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Giant Navy Ohara"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op12JaguarDSaul050I18n,
};
