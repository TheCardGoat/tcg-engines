import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { zoomIn } from "./zoom-in.ts";

export const zoomInI18n = defineFamilyI18n(zoomIn, {
  en: {
    name: "Zoom In",
    text: "When you attack with Zoom in, opt X, where X is the number of times you have boosted this combat chain.\nBoost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: zoomInRedI18n,
  yellow: zoomInYellowI18n,
  blue: zoomInBlueI18n,
} = zoomInI18n.cards;
