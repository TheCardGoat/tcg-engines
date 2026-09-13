import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gestureOfGoodwill } from "./gesture-of-goodwill.ts";

export const gestureOfGoodwillI18n = defineFamilyI18n(gestureOfGoodwill, {
  en: {
    name: "Gesture of Goodwill",
    typeText: "Generic Block",
    text: "Protect\nWhen this protects another hero, they may give you a token they control.",
  },
});

export const { blue: gestureOfGoodwillBlueI18n } = gestureOfGoodwillI18n.cards;
