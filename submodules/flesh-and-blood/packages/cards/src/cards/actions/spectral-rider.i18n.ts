import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spectralRider } from "./spectral-rider.ts";

export const spectralRiderI18n = defineFamilyI18n(spectralRider, {
  en: {
    name: "Spectral Rider",
    typeText: "Illusionist Action - Attack",
    text: "When you play Spectral Rider, if you control a Spectral Shield, this gains overpower.\nPhantasm",
  },
});

export const {
  red: spectralRiderRedI18n,
  yellow: spectralRiderYellowI18n,
  blue: spectralRiderBlueI18n,
} = spectralRiderI18n.cards;
