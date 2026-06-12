import type { CharacterCard } from "@tcg/op-types";
import { op06Raki113I18n } from "./113-raki.i18n.ts";

export const op06Raki113: CharacterCard = {
  id: "OP06-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  effect:
    "If you have a [Shandian Warrior] type Character other than [Raki], this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op06Raki113I18n,
};
