import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { battleClearingBellow } from "./battle-clearing-bellow.ts";

export const battleClearingBellowI18n = defineFamilyI18n(battleClearingBellow, {
  en: {
    name: "Battle Clearing Bellow",
    typeText: "Brute Action",
    text: "Your next attack with 6 or more base {p} this turn gets +6{p}.\nGo again",
  },
});

export const { blue: battleClearingBellowBlueI18n } = battleClearingBellowI18n.cards;
