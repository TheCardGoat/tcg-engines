import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wageAgility } from "./wage-agility.ts";

export const wageAgilityI18n = defineFamilyI18n(wageAgility, {
  en: {
    name: "Wage Agility",
    text: "When this attacks a hero, you may wager an Agility token with them.",
    typeText: "Brute / Warrior Action - Attack",
  },
});
export const {
  red: wageAgilityRedI18n,
  yellow: wageAgilityYellowI18n,
  blue: wageAgilityBlueI18n,
} = wageAgilityI18n.cards;
