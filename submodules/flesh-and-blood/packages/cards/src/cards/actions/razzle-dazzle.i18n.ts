import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { razzleDazzle } from "./razzle-dazzle.ts";

export const razzleDazzleI18n = defineFamilyI18n(razzleDazzle, {
  en: {
    name: "Razzle Dazzle",
    text: "Boost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: razzleDazzleRedI18n,
  yellow: razzleDazzleYellowI18n,
  blue: razzleDazzleBlueI18n,
} = razzleDazzleI18n.cards;
