import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crushTheWeak } from "./crush-the-weak.ts";

export const crushTheWeakI18n = defineFamilyI18n(crushTheWeak, {
  en: {
    name: "Crush the Weak",
    text: "Crush - When this deals 4 or more damage to a hero, they can't play attack action cards with 3 or less base {p} during their next action phase.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: crushTheWeakRedI18n,
  yellow: crushTheWeakYellowI18n,
  blue: crushTheWeakBlueI18n,
} = crushTheWeakI18n.cards;
