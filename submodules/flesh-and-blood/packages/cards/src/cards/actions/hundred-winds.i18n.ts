import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hundredWinds } from "./hundred-winds.ts";

export const hundredWindsI18n = defineFamilyI18n(hundredWinds, {
  en: {
    name: "Hundred Winds",
    text: "Combo - If Hundred Winds was the last attack this combat chain, this attack gains +1{p} for each other card named Hundred Winds you control on this combat chain.\nGo again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: hundredWindsRedI18n,
  yellow: hundredWindsYellowI18n,
  blue: hundredWindsBlueI18n,
} = hundredWindsI18n.cards;
