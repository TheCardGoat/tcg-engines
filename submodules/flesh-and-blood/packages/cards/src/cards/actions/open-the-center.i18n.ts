import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { openTheCenter } from "./open-the-center.ts";

export const openTheCenterI18n = defineFamilyI18n(openTheCenter, {
  en: {
    name: "Open the Center",
    text: "Combo - If Head Jab was the last attack this combat chain, Open the Center gains +1{p}, go again, and dominate.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: openTheCenterRedI18n,
  yellow: openTheCenterYellowI18n,
  blue: openTheCenterBlueI18n,
} = openTheCenterI18n.cards;
