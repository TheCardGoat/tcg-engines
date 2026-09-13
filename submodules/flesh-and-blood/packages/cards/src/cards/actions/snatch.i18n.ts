import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { snatch } from "./snatch.ts";

export const snatchI18n = defineFamilyI18n(snatch, {
  en: {
    name: "Snatch",
    typeText: "Generic Action - Attack",
    text: "When this hits, draw a card.",
  },
});

export const {
  red: snatchRedI18n,
  yellow: snatchYellowI18n,
  blue: snatchBlueI18n,
} = snatchI18n.cards;
