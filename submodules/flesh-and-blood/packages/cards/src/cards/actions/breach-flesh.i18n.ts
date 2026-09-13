import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { breachFlesh } from "./breach-flesh.ts";

export const breachFleshI18n = defineFamilyI18n(breachFlesh, {
  en: {
    name: "Breach Flesh",
    typeText: "Shadow Action - Attack",
    text: "When this hits, create a Gate to i'Arathael token\nBlood Debt\"",
  },
});

export const {
  red: breachFleshRedI18n,
  yellow: breachFleshYellowI18n,
  blue: breachFleshBlueI18n,
} = breachFleshI18n.cards;
