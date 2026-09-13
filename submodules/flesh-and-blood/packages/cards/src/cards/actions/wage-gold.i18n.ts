import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wageGold } from "./wage-gold.ts";

export const wageGoldI18n = defineFamilyI18n(wageGold, {
  en: {
    name: "Wage Gold",
    text: "Universal\nWhen this attacks a hero, you may wager a Gold token with them.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: wageGoldRedI18n,
  yellow: wageGoldYellowI18n,
  blue: wageGoldBlueI18n,
} = wageGoldI18n.cards;
