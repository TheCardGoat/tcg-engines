import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { waningVengeance } from "./waning-vengeance.ts";

export const waningVengeanceI18n = defineFamilyI18n(waningVengeance, {
  en: {
    name: "Waning Vengeance",
    typeText: "Mystic Illusionist Instant - Aura",
    text: (ward) =>
      `When this leaves the arena, if you've pitched a blue card this turn, create a Spectral Shield token.\nWard ${ward}`,
  },
});

export const {
  red: waningVengeanceRedI18n,
  yellow: waningVengeanceYellowI18n,
  blue: waningVengeanceBlueI18n,
} = waningVengeanceI18n.cards;
