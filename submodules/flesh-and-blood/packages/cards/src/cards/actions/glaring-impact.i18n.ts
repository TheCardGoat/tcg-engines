import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { glaringImpact } from "./glaring-impact.ts";

export const glaringImpactI18n = defineFamilyI18n(glaringImpact, {
  en: {
    name: "Glaring Impact",
    typeText: "Light Warrior Action - Attack",
    text: "As an additional cost to play this, you may charge your hero's soul.\nIf a yellow card is charged this way, this gets overpower.",
  },
});

export const {
  red: glaringImpactRedI18n,
  yellow: glaringImpactYellowI18n,
  blue: glaringImpactBlueI18n,
} = glaringImpactI18n.cards;
