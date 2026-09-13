import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { excessiveBloodloss } from "./excessive-bloodloss.ts";

export const excessiveBloodlossI18n = defineFamilyI18n(excessiveBloodloss, {
  en: {
    name: "Excessive Bloodloss",
    typeText: "Assassin Action - Attack",
    text: "Contract - You are contracted to banish opponents' red cards. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck. If it's red, repeat this process once.",
  },
});

export const {
  red: excessiveBloodlossRedI18n,
  yellow: excessiveBloodlossYellowI18n,
  blue: excessiveBloodlossBlueI18n,
} = excessiveBloodlossI18n.cards;
