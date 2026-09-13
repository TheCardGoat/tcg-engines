import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { impulsiveDesire } from "./impulsive-desire.ts";

export const impulsiveDesireI18n = defineFamilyI18n(impulsiveDesire, {
  en: {
    name: "Impulsive Desire",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a hero, banish the top card of their deck.\nWhenever this banishes a reaction or instant card, gain 1{h}.",
  },
});

export const {
  red: impulsiveDesireRedI18n,
  yellow: impulsiveDesireYellowI18n,
  blue: impulsiveDesireBlueI18n,
} = impulsiveDesireI18n.cards;
