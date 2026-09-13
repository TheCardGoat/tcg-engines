import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { defenderOfDaybreak } from "./defender-of-daybreak.ts";

export const defenderOfDaybreakI18n = defineFamilyI18n(defenderOfDaybreak, {
  en: {
    name: "Defender of Daybreak",
    typeText: "Light Action - Attack",
    text: "When this defends a Shadow attack, non-equipment Light cards get +1{d} this combat chain.",
  },
});

export const {
  red: defenderOfDaybreakRedI18n,
  yellow: defenderOfDaybreakYellowI18n,
  blue: defenderOfDaybreakBlueI18n,
} = defenderOfDaybreakI18n.cards;
