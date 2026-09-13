import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wageVigor } from "./wage-vigor.ts";

export const wageVigorI18n = defineFamilyI18n(wageVigor, {
  en: {
    name: "Wage Vigor",
    text: "When this attacks a hero, you may wager a Vigor token with them.",
    typeText: "Guardian / Warrior Action - Attack",
  },
});

export const {
  red: wageVigorRedI18n,
  yellow: wageVigorYellowI18n,
  blue: wageVigorBlueI18n,
} = wageVigorI18n.cards;
