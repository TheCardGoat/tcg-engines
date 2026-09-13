import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { woundedBull } from "./wounded-bull.ts";

export const woundedBullI18n = defineFamilyI18n(woundedBull, {
  en: {
    name: "Wounded Bull",
    text: "When you play this, if you have less {h} than an opposing hero, this gains +1{p}.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: woundedBullRedI18n,
  yellow: woundedBullYellowI18n,
  blue: woundedBullBlueI18n,
} = woundedBullI18n.cards;
