import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sleepDart } from "./sleep-dart.ts";

export const sleepDartI18n = defineFamilyI18n(sleepDart, {
  en: {
    name: "Sleep Dart",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Sleep Dart hits a hero, they lose all hero card effects and activated abilities until the end of their next turn.",
  },
});

export const {
  red: sleepDartRedI18n,
  yellow: sleepDartYellowI18n,
  blue: sleepDartBlueI18n,
} = sleepDartI18n.cards;
