import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heraldOfProtection } from "./herald-of-protection.ts";

export const heraldOfProtectionI18n = defineFamilyI18n(heraldOfProtection, {
  en: {
    name: "Herald of Protection",
    typeText: "Light Illusionist Action - Attack",
    text: "When this hits, put it into your soul and create a Spectral Shield token.\nPhantasm",
  },
});

export const {
  red: heraldOfProtectionRedI18n,
  yellow: heraldOfProtectionYellowI18n,
  blue: heraldOfProtectionBlueI18n,
} = heraldOfProtectionI18n.cards;
