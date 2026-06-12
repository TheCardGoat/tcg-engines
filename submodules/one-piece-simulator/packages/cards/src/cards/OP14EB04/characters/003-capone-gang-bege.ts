import type { CharacterCard } from "@tcg/op-types";
import { op14eb04CaponeGangBege003I18n } from "./003-capone-gang-bege.i18n.ts";

export const op14eb04CaponeGangBege003: CharacterCard = {
  id: "OP14-003",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Firetank Pirates Supernovas"],
  attribute: "ranged",
  effect:
    "This Character cannot be K.O.'d by effects of your opponent's Characters with 5000 base power or less.",
  i18n: op14eb04CaponeGangBege003I18n,
};
