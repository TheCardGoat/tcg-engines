import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteGalette107I18n } from "./107-charlotte-galette.i18n.ts";

export const op03CharlotteGalette107: CharacterCard = {
  id: "OP03-107",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op03CharlotteGalette107I18n,
};
