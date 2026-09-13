import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { headJab } from "./head-jab.ts";

export const headJabI18n = defineFamilyI18n(headJab, {
  en: {
    name: "Head Jab",
    typeText: "Ninja Action - Attack",
    text: "Go again",
  },
});

export const {
  red: headJabRedI18n,
  yellow: headJabYellowI18n,
  blue: headJabBlueI18n,
} = headJabI18n.cards;
