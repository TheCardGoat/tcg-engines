import type { CharacterCard } from "@tcg/op-types";
import { op05Kuween024I18n } from "./024-kuween.i18n.ts";

export const op05Kuween024: CharacterCard = {
  id: "OP05-024",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op05Kuween024I18n,
};
