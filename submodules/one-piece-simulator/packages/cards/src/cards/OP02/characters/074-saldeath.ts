import type { CharacterCard } from "@tcg/op-types";
import { op02Saldeath074I18n } from "./074-saldeath.i18n.ts";

export const op02Saldeath074: CharacterCard = {
  id: "OP02-074",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Impel Down"],
  attribute: "wisdom",
  effect:
    "Your [Blugori] gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op02Saldeath074I18n,
};
