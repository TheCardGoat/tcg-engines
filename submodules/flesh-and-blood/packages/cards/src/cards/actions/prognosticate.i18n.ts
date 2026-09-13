import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { prognosticate } from "./prognosticate.ts";

export const prognosticateI18n = defineFamilyI18n(prognosticate, {
  en: {
    name: "Prognosticate",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage, opt 1.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: prognosticateRedI18n,
  yellow: prognosticateYellowI18n,
  blue: prognosticateBlueI18n,
} = prognosticateI18n.cards;
