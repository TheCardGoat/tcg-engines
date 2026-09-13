import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sap } from "./sap.ts";

export const sapI18n = defineFamilyI18n(sap, {
  en: {
    name: "Sap",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage to a hero, you may remove an energy counter from a permanent they control.`,
    typeText: "Wizard Action",
  },
});

export const { red: sapRedI18n, yellow: sapYellowI18n, blue: sapBlueI18n } = sapI18n.cards;
