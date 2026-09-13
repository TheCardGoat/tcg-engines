import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { winterSBite } from "./winter-s-bite.ts";

export const winterSBiteI18n = defineFamilyI18n(winterSBite, {
  en: {
    name: "Winter's Bite",
    text: ({ resources }) =>
      `Target hero discards a card unless they pay ${"{r}".repeat(resources)}.`,
    typeText: "Ice Action",
  },
});

export const {
  red: winterSBiteRedI18n,
  yellow: winterSBiteYellowI18n,
  blue: winterSBiteBlueI18n,
} = winterSBiteI18n.cards;
