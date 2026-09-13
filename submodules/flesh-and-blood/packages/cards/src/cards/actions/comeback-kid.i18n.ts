import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { comebackKid } from "./comeback-kid.ts";

export const comebackKidI18n = defineFamilyI18n(comebackKid, {
  en: {
    name: "Comeback Kid",
    text: "When this attacks a hero, if you have less {h} than them, the crowd cheers you.\nIf you've been cheered this turn, this gets +1{p}.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: comebackKidRedI18n,
  yellow: comebackKidYellowI18n,
  blue: comebackKidBlueI18n,
} = comebackKidI18n.cards;
