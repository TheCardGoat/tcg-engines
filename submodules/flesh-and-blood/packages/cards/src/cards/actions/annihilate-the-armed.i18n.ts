import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { annihilateTheArmed } from "./annihilate-the-armed.ts";

export const annihilateTheArmedI18n = defineFamilyI18n(annihilateTheArmed, {
  en: {
    name: "Annihilate the Armed",
    typeText: "Assassin Action - Attack",
    text: "Contract - You are contracted to banish opponents' attack action cards. Whenever you complete this contract, create a Silver token.\nWhen this hits a hero, banish the top card of their deck.",
  },
});

export const {
  red: annihilateTheArmedRedI18n,
  yellow: annihilateTheArmedYellowI18n,
  blue: annihilateTheArmedBlueI18n,
} = annihilateTheArmedI18n.cards;
