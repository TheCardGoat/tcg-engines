import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overflowTheAetherwell } from "./overflow-the-aetherwell.ts";

export const overflowTheAetherwellI18n = defineFamilyI18n(overflowTheAetherwell, {
  en: {
    name: "Overflow the Aetherwell",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage, gain {r}{r}.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: overflowTheAetherwellRedI18n,
  yellow: overflowTheAetherwellYellowI18n,
  blue: overflowTheAetherwellBlueI18n,
} = overflowTheAetherwellI18n.cards;
