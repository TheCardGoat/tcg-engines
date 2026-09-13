import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { isolate } from "./isolate.ts";

export const isolateI18n = defineFamilyI18n(isolate, {
  en: {
    name: "Isolate",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nDominate",
  },
});

export const {
  red: isolateRedI18n,
  yellow: isolateYellowI18n,
  blue: isolateBlueI18n,
} = isolateI18n.cards;
