import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherQuickening } from "./aether-quickening.ts";

export const aetherQuickeningI18n = defineFamilyI18n(aetherQuickening, {
  en: {
    name: "Aether Quickening",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage, it gets go again.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: aetherQuickeningRedI18n,
  yellow: aetherQuickeningYellowI18n,
  blue: aetherQuickeningBlueI18n,
} = aetherQuickeningI18n.cards;
