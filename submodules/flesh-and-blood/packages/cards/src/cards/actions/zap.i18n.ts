import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { zap } from "./zap.ts";

export const zapI18n = defineFamilyI18n(zap, {
  en: {
    name: "Zap",
    text: ({ damage }) => `Deal ${damage} arcane damage to target hero.`,
    typeText: "Wizard Action",
  },
});

export const { red: zapRedI18n, yellow: zapYellowI18n, blue: zapBlueI18n } = zapI18n.cards;
