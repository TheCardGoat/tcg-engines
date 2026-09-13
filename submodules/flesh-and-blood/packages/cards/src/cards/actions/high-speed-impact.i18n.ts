import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { highSpeedImpact } from "./high-speed-impact.ts";

export const highSpeedImpactI18n = defineFamilyI18n(highSpeedImpact, {
  en: {
    name: "High Speed Impact",
    text: "If High Speed Impact hits, the next attack you boost this combat chain gains dominate.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: highSpeedImpactRedI18n,
  yellow: highSpeedImpactYellowI18n,
  blue: highSpeedImpactBlueI18n,
} = highSpeedImpactI18n.cards;
