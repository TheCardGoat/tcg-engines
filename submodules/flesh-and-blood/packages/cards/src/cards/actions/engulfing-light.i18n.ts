import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { engulfingLight } from "./engulfing-light.ts";

export const engulfingLightI18n = defineFamilyI18n(engulfingLight, {
  en: {
    name: "Engulfing Light",
    typeText: "Light Warrior Action - Attack",
    text: "As an additional cost to play Engulfing Light, you may charge your hero's soul.\nIf you've charged this turn, Engulfing Light gains \"If this hits, put it into your hero's soul.\"",
  },
});

export const {
  red: engulfingLightRedI18n,
  yellow: engulfingLightYellowI18n,
  blue: engulfingLightBlueI18n,
} = engulfingLightI18n.cards;
