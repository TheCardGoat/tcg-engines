import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { thwart } from "./thwart.ts";

export const thwartI18n = defineFamilyI18n(thwart, {
  en: {
    name: "Thwart",
    text: "When this defends, remove all +1{p} counters from the attacking card.",
    typeText: "Generic Block",
  },
});
export const { yellow: thwartYellowI18n } = thwartI18n.cards;
