import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { poundForPound } from "./pound-for-pound.ts";

export const poundForPoundI18n = defineFamilyI18n(poundForPound, {
  en: {
    name: "Pound for Pound",
    text: "When you play Pound for Pound, if you have less {h} than an opposing hero, it gains dominate.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: poundForPoundRedI18n,
  yellow: poundForPoundYellowI18n,
  blue: poundForPoundBlueI18n,
} = poundForPoundI18n.cards;
