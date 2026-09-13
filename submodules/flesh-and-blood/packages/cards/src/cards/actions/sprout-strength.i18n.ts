import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sproutStrength } from "./sprout-strength.ts";

export const sproutStrengthI18n = defineFamilyI18n(sproutStrength, {
  en: {
    name: "Sprout Strength",
    text: "Your next attack this turn gets +1{p}.\nYour next attack this turn gets +1{p}.\nYour next attack this turn gets +1{p}.\nGo again",
    typeText: "Earth Action",
  },
});
export const {
  red: sproutStrengthRedI18n,
  yellow: sproutStrengthYellowI18n,
  blue: sproutStrengthBlueI18n,
} = sproutStrengthI18n.cards;
