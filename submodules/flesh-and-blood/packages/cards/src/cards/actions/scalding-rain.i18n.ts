import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scaldingRain } from "./scalding-rain.ts";

export const scaldingRainI18n = defineFamilyI18n(scaldingRain, {
  en: {
    name: "Scalding Rain",
    text: ({ damage }) => `Deal ${damage} arcane damage to target hero.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: scaldingRainRedI18n,
  yellow: scaldingRainYellowI18n,
  blue: scaldingRainBlueI18n,
} = scaldingRainI18n.cards;
