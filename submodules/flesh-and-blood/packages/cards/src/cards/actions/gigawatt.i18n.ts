import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gigawatt } from "./gigawatt.ts";

export const gigawattI18n = defineFamilyI18n(gigawatt, {
  en: {
    name: "Gigawatt",
    text: ({ value1 }) => `Your next Mechanologist attack this turn gets +${value1}{p}.\nGo again`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: gigawattRedI18n,
  yellow: gigawattYellowI18n,
  blue: gigawattBlueI18n,
} = gigawattI18n.cards;
