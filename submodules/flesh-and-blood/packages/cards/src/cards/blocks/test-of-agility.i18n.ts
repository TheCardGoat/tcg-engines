import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { testOfAgility } from "./test-of-agility.ts";

export const testOfAgilityI18n = defineFamilyI18n(testOfAgility, {
  en: {
    name: "Test of Agility",
    text: "When this defends, clash with the attacking hero. The winner creates an Agility token.",
    typeText: "Brute / Warrior Block",
  },
});

export const { red: testOfAgilityRedI18n } = testOfAgilityI18n.cards;
