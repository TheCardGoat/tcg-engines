import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { robTheRich } from "./rob-the-rich.ts";

export const robTheRichI18n = defineFamilyI18n(robTheRich, {
  en: {
    name: "Rob the Rich",
    text: "Contract - You are contracted to banish opponents' cards with cost 2 or greater. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: robTheRichRedI18n,
  yellow: robTheRichYellowI18n,
  blue: robTheRichBlueI18n,
} = robTheRichI18n.cards;
