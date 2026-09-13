import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sigilOfProtection } from "./sigil-of-protection.ts";

export const sigilOfProtectionI18n = defineFamilyI18n(sigilOfProtection, {
  en: {
    name: "Sigil of Protection",
    typeText: "Generic Action - Aura",
    text: ({ wardAmount }) =>
      `Ward ${wardAmount}\nAt the beginning of your action phase, destroy Sigil of Protection.`,
  },
});

export const {
  red: sigilOfProtectionRedI18n,
  yellow: sigilOfProtectionYellowI18n,
  blue: sigilOfProtectionBlueI18n,
} = sigilOfProtectionI18n.cards;
