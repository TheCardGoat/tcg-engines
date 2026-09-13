import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { zeroToFifty } from "./zero-to-fifty.ts";

export const zeroToFiftyI18n = defineFamilyI18n(zeroToFifty, {
  en: {
    name: "Zero to Fifty",
    text: "Boost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: zeroToFiftyRedI18n,
  yellow: zeroToFiftyYellowI18n,
  blue: zeroToFiftyBlueI18n,
} = zeroToFiftyI18n.cards;
