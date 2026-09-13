import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { belowTheBelt } from "./below-the-belt.ts";

export const belowTheBeltI18n = defineFamilyI18n(belowTheBelt, {
  en: {
    name: "Below the Belt",
    typeText: "Warrior Action",
    text: 'Your next sword attack this turn gets +4{p} and "When this hits a Warrior hero, destroy a card in their arsenal."\nGo again',
  },
});

export const { red: belowTheBeltRedI18n } = belowTheBeltI18n.cards;
