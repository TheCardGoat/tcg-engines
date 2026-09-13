import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spectralProwler } from "./spectral-prowler.ts";

export const spectralProwlerI18n = defineFamilyI18n(spectralProwler, {
  en: {
    name: "Spectral Prowler",
    typeText: "Illusionist Action - Attack",
    text: "When you play Spectral Prowler, if you control a Spectral Shield, this gains go again.\nPhantasm",
  },
});

export const {
  red: spectralProwlerRedI18n,
  yellow: spectralProwlerYellowI18n,
  blue: spectralProwlerBlueI18n,
} = spectralProwlerI18n.cards;
