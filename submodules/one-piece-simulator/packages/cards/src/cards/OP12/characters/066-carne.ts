import type { CharacterCard } from "@tcg/op-types";
import { op12Carne066I18n } from "./066-carne.i18n.ts";

export const op12Carne066: CharacterCard = {
  id: "OP12-066",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "If you have 4 or more Events in your trash, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op12Carne066I18n,
};
