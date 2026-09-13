import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { evasiveLeap } from "./evasive-leap.ts";

export const evasiveLeapI18n = defineFamilyI18n(evasiveLeap, {
  en: { name: "Evasive Leap", typeText: "Generic Defense Reaction" },
});

export const {
  red: evasiveLeapRedI18n,
  yellow: evasiveLeapYellowI18n,
  blue: evasiveLeapBlueI18n,
} = evasiveLeapI18n.cards;
