import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fleeceTheFrail } from "./fleece-the-frail.ts";

export const fleeceTheFrailI18n = defineFamilyI18n(fleeceTheFrail, {
  en: {
    name: "Fleece the Frail",
    typeText: "Assassin Action - Attack",
    text: "Contract - You are contracted to banish opponents' cards with 2 or less {d}. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
  },
});

export const {
  red: fleeceTheFrailRedI18n,
  yellow: fleeceTheFrailYellowI18n,
  blue: fleeceTheFrailBlueI18n,
} = fleeceTheFrailI18n.cards;
