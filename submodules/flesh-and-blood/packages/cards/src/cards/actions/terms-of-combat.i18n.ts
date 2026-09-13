import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { termsOfCombat } from "./terms-of-combat.ts";

export const termsOfCombatI18n = defineFamilyI18n(termsOfCombat, {
  en: {
    name: "Terms of Combat",
    typeText: "Warrior Action",
    text: 'Your next weapon attack this turn gets +4{p} and "Whenever a defense reaction is played or activated this chain link, draw a card."\nGo again',
  },
});

export const { red: termsOfCombatRedI18n } = termsOfCombatI18n.cards;
