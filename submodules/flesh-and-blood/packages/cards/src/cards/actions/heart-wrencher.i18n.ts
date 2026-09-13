import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heartWrencher } from "./heart-wrencher.ts";

export const heartWrencherI18n = defineFamilyI18n(heartWrencher, {
  en: {
    name: "Heart Wrencher",
    text: "Boost",
    typeText: "Mechanologist Action - Wrench Attack",
  },
});

export const {
  red: heartWrencherRedI18n,
  yellow: heartWrencherYellowI18n,
  blue: heartWrencherBlueI18n,
} = heartWrencherI18n.cards;
