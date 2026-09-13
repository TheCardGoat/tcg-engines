import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shimmeringSpecter } from "./shimmering-specter.ts";

export const shimmeringSpecterI18n = defineFamilyI18n(shimmeringSpecter, {
  en: {
    name: "Shimmering Specter",
    typeText: "Illusionist Action - Attack",
    text: "While this is attacking or defending, when this leaves the arena, create a Spectral Shield token.\nMirage",
  },
});

export const {
  red: shimmeringSpecterRedI18n,
  yellow: shimmeringSpecterYellowI18n,
  blue: shimmeringSpecterBlueI18n,
} = shimmeringSpecterI18n.cards;
