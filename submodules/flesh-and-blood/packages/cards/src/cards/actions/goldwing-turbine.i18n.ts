import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { goldwingTurbine } from "./goldwing-turbine.ts";

export const goldwingTurbineI18n = defineFamilyI18n(goldwingTurbine, {
  en: {
    name: "Goldwing Turbine",
    text: ({ value1 }) =>
      `Your next Mechanologist attack this turn gets +${value1}{p}.\nCreate a Golden Cog token.`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: goldwingTurbineRedI18n,
  yellow: goldwingTurbineYellowI18n,
  blue: goldwingTurbineBlueI18n,
} = goldwingTurbineI18n.cards;
