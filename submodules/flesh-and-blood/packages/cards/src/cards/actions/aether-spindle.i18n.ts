import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { aetherSpindle } from "./aether-spindle.ts";

export const aetherSpindleI18n = defineFamilyI18n(aetherSpindle, {
  en: {
    name: "Aether Spindle",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target opposing hero.\nOpt X, where X is the damage dealt by Aether Spindle.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: aetherSpindleRedI18n,
  yellow: aetherSpindleYellowI18n,
  blue: aetherSpindleBlueI18n,
} = aetherSpindleI18n.cards;
