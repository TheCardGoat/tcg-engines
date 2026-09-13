import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wageMight } from "./wage-might.ts";

export const wageMightI18n = defineFamilyI18n(wageMight, {
  en: {
    name: "Wage Might",
    text: "When this attacks a hero, you may wager a Might token with them.",
    typeText: "Brute / Guardian Action - Attack",
  },
});

export const {
  red: wageMightRedI18n,
  yellow: wageMightYellowI18n,
  blue: wageMightBlueI18n,
} = wageMightI18n.cards;
