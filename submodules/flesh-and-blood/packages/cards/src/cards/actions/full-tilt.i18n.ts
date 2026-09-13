import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fullTilt } from "./full-tilt.ts";

export const fullTiltI18n = defineFamilyI18n(fullTilt, {
  en: {
    name: "Full Tilt",
    text: "Boost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: fullTiltRedI18n,
  yellow: fullTiltYellowI18n,
  blue: fullTiltBlueI18n,
} = fullTiltI18n.cards;
