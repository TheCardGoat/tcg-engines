import type { CharacterCard } from "@tcg/op-types";
import { op13Koby025I18n } from "./025-koby.i18n.ts";

export const op13Koby025: CharacterCard = {
  id: "OP13-025",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM Navy"],
  attribute: "strike",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If your Leader has the "FILM" type or the "Strike" attribute, set up to 1 of your DON!! cards as active.',
  effects: {
    keywords: ["blocker"],
  },
  i18n: op13Koby025I18n,
};
