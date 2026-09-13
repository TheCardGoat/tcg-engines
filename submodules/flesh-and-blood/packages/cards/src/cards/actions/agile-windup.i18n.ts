import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { agileWindup } from "./agile-windup.ts";

export const agileWindupI18n = defineFamilyI18n(agileWindup, {
  en: {
    name: "Agile Windup",
    text: "Instant - Discard this: Create an Agility token.",
    typeText: "Brute / Warrior Action - Attack",
  },
});
export const {
  red: agileWindupRedI18n,
  yellow: agileWindupYellowI18n,
  blue: agileWindupBlueI18n,
} = agileWindupI18n.cards;
