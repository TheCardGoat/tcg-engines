import type { CharacterCard } from "@tcg/op-types";
import { op08TwentyDoctors003I18n } from "./003-twenty-doctors.i18n.ts";

export const op08TwentyDoctors003: CharacterCard = {
  id: "OP08-003",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op08TwentyDoctors003I18n,
};
