import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeYonji067I18n } from "./067-vinsmoke-yonji.i18n.ts";

export const op06VinsmokeYonji067: CharacterCard = {
  id: "OP06-067",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  effect:
    "If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, this Character gains +1000 power.\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op06VinsmokeYonji067I18n,
};
