import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gravelingGrowl } from "./graveling-growl.ts";

export const gravelingGrowlI18n = defineFamilyI18n(gravelingGrowl, {
  en: {
    name: "Graveling Growl",
    text: "Play Graveling Growl only if a card with 6 or more {p} has been put into your banished zone this turn.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: gravelingGrowlRedI18n,
  yellow: gravelingGrowlYellowI18n,
  blue: gravelingGrowlBlueI18n,
} = gravelingGrowlI18n.cards;
