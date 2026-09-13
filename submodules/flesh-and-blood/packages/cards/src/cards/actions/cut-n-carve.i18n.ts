import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cutNCarve } from "./cut-n-carve.ts";

export const cutNCarveI18n = defineFamilyI18n(cutNCarve, {
  en: {
    name: "Cut n' Carve",
    text: (threshold) =>
      `Sharpen target sword you control.\nIf it has ${threshold} or more +1{p} counters, its next attack this turn gets dominate.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: cutNCarveRedI18n,
  yellow: cutNCarveYellowI18n,
  blue: cutNCarveBlueI18n,
} = cutNCarveI18n.cards;
