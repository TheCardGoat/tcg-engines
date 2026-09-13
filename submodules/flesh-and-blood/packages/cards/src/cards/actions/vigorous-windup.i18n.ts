import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vigorousWindup } from "./vigorous-windup.ts";

export const vigorousWindupI18n = defineFamilyI18n(vigorousWindup, {
  en: {
    name: "Vigorous Windup",
    text: "Instant - Discard this: Create a Vigor token.",
    typeText: "Guardian / Warrior Action - Attack",
  },
});

export const {
  red: vigorousWindupRedI18n,
  yellow: vigorousWindupYellowI18n,
  blue: vigorousWindupBlueI18n,
} = vigorousWindupI18n.cards;
