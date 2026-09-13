import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mechanicalStrength } from "./mechanical-strength.ts";

export const mechanicalStrengthI18n = defineFamilyI18n(mechanicalStrength, {
  en: {
    name: "Mechanical Strength",
    text: "Evo Upgrade - This gets +X{p}, where X is the number of Evos you have equipped.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: mechanicalStrengthRedI18n,
  yellow: mechanicalStrengthYellowI18n,
  blue: mechanicalStrengthBlueI18n,
} = mechanicalStrengthI18n.cards;
