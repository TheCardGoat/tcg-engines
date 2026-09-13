import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scramblePulse } from "./scramble-pulse.ts";

export const scramblePulseI18n = defineFamilyI18n(scramblePulse, {
  en: {
    name: "Scramble Pulse",
    text: "Equipment have -1{d} while defending this combat chain.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: scramblePulseRedI18n,
  yellow: scramblePulseYellowI18n,
  blue: scramblePulseBlueI18n,
} = scramblePulseI18n.cards;
