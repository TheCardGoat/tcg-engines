import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { insultToInjury } from "./insult-to-injury.ts";

export const insultToInjuryI18n = defineFamilyI18n(insultToInjury, {
  en: {
    name: "Insult to Injury",
    text: "When this attacks a hero, if you have more {h} than them, this gets go again.",
    typeText: "Reviled Action - Attack",
  },
});
export const {
  red: insultToInjuryRedI18n,
  yellow: insultToInjuryYellowI18n,
  blue: insultToInjuryBlueI18n,
} = insultToInjuryI18n.cards;
