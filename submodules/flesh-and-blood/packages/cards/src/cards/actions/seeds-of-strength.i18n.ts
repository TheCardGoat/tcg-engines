import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { seedsOfStrength } from "./seeds-of-strength.ts";

export const seedsOfStrengthI18n = defineFamilyI18n(seedsOfStrength, {
  en: {
    name: "Seeds of Strength",
    text: (parameter) =>
      `Create ${parameter.base} Might tokens.\nEarth Bond - If an Earth card was pitched to play this, instead create ${parameter.earth} Might tokens`,
    typeText: "Elemental Guardian Action",
  },
});
export const {
  red: seedsOfStrengthRedI18n,
  yellow: seedsOfStrengthYellowI18n,
  blue: seedsOfStrengthBlueI18n,
} = seedsOfStrengthI18n.cards;
