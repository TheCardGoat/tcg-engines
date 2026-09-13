import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { risingKneeThrust } from "./rising-knee-thrust.ts";

export const risingKneeThrustI18n = defineFamilyI18n(risingKneeThrust, {
  en: {
    name: "Rising Knee Thrust",
    text: "Combo - If Leg Tap was the last attack this combat chain, Rising Knee Thrust gains +2{p} and go again.",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: risingKneeThrustRedI18n,
  yellow: risingKneeThrustYellowI18n,
  blue: risingKneeThrustBlueI18n,
} = risingKneeThrustI18n.cards;
