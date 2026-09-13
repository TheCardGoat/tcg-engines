import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pouncingQi } from "./pouncing-qi.ts";

export const pouncingQiI18n = defineFamilyI18n(pouncingQi, {
  en: {
    name: "Pouncing Qi",
    text: "Combo - If Crouching Tiger was the last attack this combat chain, this gets +1{p} and go again.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: pouncingQiRedI18n,
  yellow: pouncingQiYellowI18n,
  blue: pouncingQiBlueI18n,
} = pouncingQiI18n.cards;
