import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { zeroToSixty } from "./zero-to-sixty.ts";

export const zeroToSixtyI18n = defineFamilyI18n(zeroToSixty, {
  en: {
    name: "Zero to Sixty",
    text: "Boost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: zeroToSixtyRedI18n,
  yellow: zeroToSixtyYellowI18n,
  blue: zeroToSixtyBlueI18n,
} = zeroToSixtyI18n.cards;
