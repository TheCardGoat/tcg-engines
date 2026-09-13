import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { strongestSurvive } from "./strongest-survive.ts";

export const strongestSurviveI18n = defineFamilyI18n(strongestSurvive, {
  en: {
    name: "Strongest Survive",
    text: "When this hits a hero, they discard a card unless they reveal a card from their hand with {p} greater than the damage dealt this way.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: strongestSurviveRedI18n,
  yellow: strongestSurviveYellowI18n,
  blue: strongestSurviveBlueI18n,
} = strongestSurviveI18n.cards;
