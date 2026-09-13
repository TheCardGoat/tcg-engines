import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flexStrength } from "./flex-strength.ts";

export const flexStrengthI18n = defineFamilyI18n(flexStrength, {
  en: {
    name: "Flex Strength",
    text: "If this has 6 or more {p}, it gets +3{p}.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: flexStrengthRedI18n,
  yellow: flexStrengthYellowI18n,
  blue: flexStrengthBlueI18n,
} = flexStrengthI18n.cards;
