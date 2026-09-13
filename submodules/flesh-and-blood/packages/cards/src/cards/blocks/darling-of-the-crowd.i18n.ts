import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { darlingOfTheCrowd } from "./darling-of-the-crowd.ts";

export const darlingOfTheCrowdI18n = defineFamilyI18n(darlingOfTheCrowd, {
  en: {
    name: "Darling of the Crowd",
    text: "While this is defending, if you've been cheered this turn, it gets +1{d}.",
    typeText: "Revered Block",
  },
});

export const { yellow: darlingOfTheCrowdYellowI18n } = darlingOfTheCrowdI18n.cards;
