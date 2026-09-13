import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfAgility } from "./clash-of-agility.ts";

export const clashOfAgilityI18n = defineFamilyI18n(clashOfAgility, {
  en: {
    name: "Clash of Agility",
    text: "When this defends, clash with the attacking hero. The winner creates an Agility token.",
    typeText: "Brute / Warrior Action - Attack",
  },
});
export const {
  red: clashOfAgilityRedI18n,
  yellow: clashOfAgilityYellowI18n,
  blue: clashOfAgilityBlueI18n,
} = clashOfAgilityI18n.cards;
