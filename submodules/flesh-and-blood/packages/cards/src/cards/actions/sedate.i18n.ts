import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sedate } from "./sedate.ts";

export const sedateI18n = defineFamilyI18n(sedate, {
  en: {
    name: "Sedate",
    text: "Stealth\nWhen this hits a hero, create an Inertia token under their control.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: sedateRedI18n,
  yellow: sedateYellowI18n,
  blue: sedateBlueI18n,
} = sedateI18n.cards;
