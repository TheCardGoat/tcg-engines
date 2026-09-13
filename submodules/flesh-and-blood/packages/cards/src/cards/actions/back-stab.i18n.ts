import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { backStab } from "./back-stab.ts";

export const backStabI18n = defineFamilyI18n(backStab, {
  en: {
    name: "Back Stab",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nDefense reaction cards can't be played this chain link.",
  },
});

export const {
  red: backStabRedI18n,
  yellow: backStabYellowI18n,
  blue: backStabBlueI18n,
} = backStabI18n.cards;
