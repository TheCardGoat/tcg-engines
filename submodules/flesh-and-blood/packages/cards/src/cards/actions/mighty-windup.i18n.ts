import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mightyWindup } from "./mighty-windup.ts";

export const mightyWindupI18n = defineFamilyI18n(mightyWindup, {
  en: {
    name: "Mighty Windup",
    text: "Instant - Discard this: Create a Might token.",
    typeText: "Brute / Guardian Action - Attack",
  },
});

export const {
  red: mightyWindupRedI18n,
  yellow: mightyWindupYellowI18n,
  blue: mightyWindupBlueI18n,
} = mightyWindupI18n.cards;
