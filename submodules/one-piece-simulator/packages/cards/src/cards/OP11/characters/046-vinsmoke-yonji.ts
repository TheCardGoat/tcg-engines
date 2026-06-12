import type { CharacterCard } from "@tcg/op-types";
import { op11VinsmokeYonji046I18n } from "./046-vinsmoke-yonji.i18n.ts";

export const op11VinsmokeYonji046: CharacterCard = {
  id: "OP11-046",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\nIf you only have Characters with a type including \"GERMA\", this Character cannot be K.O.'d or rested by your opponent's effects.",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op11VinsmokeYonji046I18n,
};
