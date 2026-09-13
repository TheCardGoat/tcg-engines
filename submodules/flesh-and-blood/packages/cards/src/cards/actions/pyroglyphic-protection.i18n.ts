import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pyroglyphicProtection } from "./pyroglyphic-protection.ts";

export const pyroglyphicProtectionI18n = defineFamilyI18n(pyroglyphicProtection, {
  en: {
    name: "Pyroglyphic Protection",
    text: (_parameter, color) =>
      `If your hero would be dealt arcane damage, prevent ${color === "red" ? 3 : color === "yellow" ? 2 : 1} arcane damage that source would deal.\nAt the beginning of your action phase, destroy Pyroglyphic Protection.`,
    typeText: "Wizard Action - Aura",
  },
});

export const {
  red: pyroglyphicProtectionRedI18n,
  yellow: pyroglyphicProtectionYellowI18n,
  blue: pyroglyphicProtectionBlueI18n,
} = pyroglyphicProtectionI18n.cards;
