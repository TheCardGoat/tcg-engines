import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { buckwild } from "./buckwild.ts";

export const buckwildI18n = defineFamilyI18n(buckwild, {
  en: {
    name: "Buckwild",
    text: "If there is a card with 6 or more {p} in your pitch zone, this gets go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: buckwildRedI18n,
  yellow: buckwildYellowI18n,
  blue: buckwildBlueI18n,
} = buckwildI18n.cards;
