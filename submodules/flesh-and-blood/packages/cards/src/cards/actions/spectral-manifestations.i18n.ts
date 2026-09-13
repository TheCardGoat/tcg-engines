import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spectralManifestations } from "./spectral-manifestations.ts";

export const spectralManifestationsI18n = defineFamilyI18n(spectralManifestations, {
  en: {
    name: "Spectral Manifestations",
    typeText: "Illusionist Action",
    text: "Create a Spectral Shield token, then if you control no other Illusionist auras, put three +1{p} counters on it.\nGo again",
  },
});

export const {
  red: spectralManifestationsRedI18n,
  yellow: spectralManifestationsYellowI18n,
  blue: spectralManifestationsBlueI18n,
} = spectralManifestationsI18n.cards;
