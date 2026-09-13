import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { perennialAetherbloom } from "./perennial-aetherbloom.ts";

export const perennialAetherbloomI18n = defineFamilyI18n(perennialAetherbloom, {
  en: {
    name: "Perennial Aetherbloom",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage, put it on the bottom of its owner's deck.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: perennialAetherbloomRedI18n,
  yellow: perennialAetherbloomYellowI18n,
  blue: perennialAetherbloomBlueI18n,
} = perennialAetherbloomI18n.cards;
