import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { disdainfulDelight } from "./disdainful-delight.ts";

export const disdainfulDelightI18n = defineFamilyI18n(disdainfulDelight, {
  en: {
    name: "Disdainful Delight",
    text: "While this is defending, if you've been booed this turn, this gets +1{d}.",
    typeText: "Reviled Block",
  },
});

export const { yellow: disdainfulDelightYellowI18n } = disdainfulDelightI18n.cards;
