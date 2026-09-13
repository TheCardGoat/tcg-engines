import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cutDeep } from "./cut-deep.ts";

export const cutDeepI18n = defineFamilyI18n(cutDeep, {
  en: {
    name: "Cut Deep",
    text: (amount) => `Your next dagger attack this turn gets +${amount}{p}.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: cutDeepRedI18n,
  yellow: cutDeepYellowI18n,
  blue: cutDeepBlueI18n,
} = cutDeepI18n.cards;
