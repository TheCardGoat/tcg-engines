import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { beastMode } from "./beast-mode.ts";

export const beastModeI18n = defineFamilyI18n(beastMode, {
  en: {
    name: "Beast Mode",
    text: "If you've intimidated this turn, this gets +2{p}.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: beastModeRedI18n,
  yellow: beastModeYellowI18n,
  blue: beastModeBlueI18n,
} = beastModeI18n.cards;
