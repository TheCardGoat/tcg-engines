import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stadiumSecurity } from "./stadium-security.ts";

export const stadiumSecurityI18n = defineFamilyI18n(stadiumSecurity, {
  en: {
    name: "Stadium Security",
    text: "While this is in your arsenal, if you've controlled a Toughness token this turn, this gets ambush.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: stadiumSecurityRedI18n,
  yellow: stadiumSecurityYellowI18n,
  blue: stadiumSecurityBlueI18n,
} = stadiumSecurityI18n.cards;
