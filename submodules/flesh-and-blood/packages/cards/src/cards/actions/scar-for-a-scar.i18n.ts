import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scarForAScar } from "./scar-for-a-scar.ts";

export const scarForAScarI18n = defineFamilyI18n(scarForAScar, {
  en: {
    name: "Scar for a Scar",
    text: "When this is played, if you have less {h} than an opposing hero, it gets go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: scarForAScarRedI18n,
  yellow: scarForAScarYellowI18n,
  blue: scarForAScarBlueI18n,
} = scarForAScarI18n.cards;
