import type { CharacterCard } from "@tcg/op-types";
import { op06Borsalino054I18n } from "./054-borsalino.i18n.ts";

export const op06Borsalino054: CharacterCard = {
  id: "OP06-054",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP06",
  cost: 2,
  power: 4000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "If you have 4 or less cards in your hand, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op06Borsalino054I18n,
};
