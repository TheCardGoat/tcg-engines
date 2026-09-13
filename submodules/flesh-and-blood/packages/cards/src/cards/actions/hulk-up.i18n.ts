import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hulkUp } from "./hulk-up.ts";

export const hulkUpI18n = defineFamilyI18n(hulkUp, {
  en: {
    name: "Hulk Up",
    text: "If you have less {h} than each other hero, this costs {r} less to play.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: hulkUpRedI18n,
  yellow: hulkUpYellowI18n,
  blue: hulkUpBlueI18n,
} = hulkUpI18n.cards;
