import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mindSDesire } from "./mind-s-desire.ts";

export const mindSDesireI18n = defineFamilyI18n(mindSDesire, {
  en: {
    name: "Mind's Desire",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a hero, banish the top card of their deck.\nWhenever this banishes a non-attack action card, gain 1{h}.",
  },
});

export const {
  red: mindSDesireRedI18n,
  yellow: mindSDesireYellowI18n,
  blue: mindSDesireBlueI18n,
} = mindSDesireI18n.cards;
