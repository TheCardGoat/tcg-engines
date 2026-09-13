import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cinderskinDevotion } from "./cinderskin-devotion.ts";

export const cinderskinDevotionI18n = defineFamilyI18n(cinderskinDevotion, {
  en: {
    name: "Cinderskin Devotion",
    text: "If you control 2 or more Draconic chain links, this gets go again.",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: cinderskinDevotionRedI18n,
  yellow: cinderskinDevotionYellowI18n,
  blue: cinderskinDevotionBlueI18n,
} = cinderskinDevotionI18n.cards;
