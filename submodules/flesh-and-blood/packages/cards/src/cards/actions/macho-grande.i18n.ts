import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { machoGrande } from "./macho-grande.ts";

export const machoGrandeI18n = defineFamilyI18n(machoGrande, {
  en: {
    name: "Macho Grande",
    text: "Dominate",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: machoGrandeRedI18n,
  yellow: machoGrandeYellowI18n,
  blue: machoGrandeBlueI18n,
} = machoGrandeI18n.cards;
