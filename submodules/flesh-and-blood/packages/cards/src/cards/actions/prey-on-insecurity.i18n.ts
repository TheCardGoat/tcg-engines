import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { preyOnInsecurity } from "./prey-on-insecurity.ts";

export const preyOnInsecurityI18n = defineFamilyI18n(preyOnInsecurity, {
  en: {
    name: "Prey on Insecurity",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nAttack Reaction - Put a card from your hand on the bottom of your deck, destroy this: Another target attack with stealth gets +3{p}.",
  },
});

export const { red: preyOnInsecurityRedI18n } = preyOnInsecurityI18n.cards;
