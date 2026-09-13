import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riledUp } from "./riled-up.ts";

export const riledUpI18n = defineFamilyI18n(riledUp, {
  en: {
    name: "Riled Up",
    text: "If you've discarded a card with 6 or more {p} this turn, this gets +1{p}.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: riledUpRedI18n,
  yellow: riledUpYellowI18n,
  blue: riledUpBlueI18n,
} = riledUpI18n.cards;
