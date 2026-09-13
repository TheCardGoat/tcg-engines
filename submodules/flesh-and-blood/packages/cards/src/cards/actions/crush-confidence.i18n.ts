import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crushConfidence } from "./crush-confidence.ts";

export const crushConfidenceI18n = defineFamilyI18n(crushConfidence, {
  en: {
    name: "Crush Confidence",
    text: "Crush - When this deals 4 or more damage to a hero, they lose all hero card abilities until the end of their next turn.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: crushConfidenceRedI18n,
  yellow: crushConfidenceYellowI18n,
  blue: crushConfidenceBlueI18n,
} = crushConfidenceI18n.cards;
