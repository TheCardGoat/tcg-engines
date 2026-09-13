import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { throttle } from "./throttle.ts";

export const throttleI18n = defineFamilyI18n(throttle, {
  en: {
    name: "Throttle",
    text: "Boost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: throttleRedI18n,
  yellow: throttleYellowI18n,
  blue: throttleBlueI18n,
} = throttleI18n.cards;
