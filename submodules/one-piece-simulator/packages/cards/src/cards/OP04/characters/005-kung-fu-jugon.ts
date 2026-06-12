import type { CharacterCard } from "@tcg/op-types";
import { op04KungFuJugon005I18n } from "./005-kung-fu-jugon.i18n.ts";

export const op04KungFuJugon005: CharacterCard = {
  id: "OP04-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Animal Alabasta"],
  attribute: "strike",
  effect:
    "If you have a [Kung Fu Jugon] other than this Character, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op04KungFuJugon005I18n,
};
