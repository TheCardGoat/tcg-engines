import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { diveThroughData } from "./dive-through-data.ts";

export const diveThroughDataI18n = defineFamilyI18n(diveThroughData, {
  en: {
    name: "Dive Through Data",
    text: "Boost\nWhen this hits, opt 1.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: diveThroughDataRedI18n,
  yellow: diveThroughDataYellowI18n,
  blue: diveThroughDataBlueI18n,
} = diveThroughDataI18n.cards;
