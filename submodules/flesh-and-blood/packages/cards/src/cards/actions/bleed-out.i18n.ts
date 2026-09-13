import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bleedOut } from "./bleed-out.ts";

export const bleedOutI18n = defineFamilyI18n(bleedOut, {
  en: {
    name: "Bleed Out",
    text: "Bleed Out costs X resource points less to play, where X is the total damage you've dealt with daggers this combat chain.\nGo again",
    typeText: "Assassin / Ninja Action - Attack",
  },
});
export const {
  red: bleedOutRedI18n,
  yellow: bleedOutYellowI18n,
  blue: bleedOutBlueI18n,
} = bleedOutI18n.cards;
