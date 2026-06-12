import type { CharacterCard } from "@tcg/op-types";
import { op06Cosette072I18n } from "./072-cosette.i18n.ts";

export const op06Cosette072: CharacterCard = {
  id: "OP06-072",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP06",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Kingdom of GERMA"],
  attribute: "wisdom",
  effect:
    "If your Leader has the [GERMA 66] type and the number of DON!! cards on your field is at least 2 less than the number on your opponent's field, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op06Cosette072I18n,
};
