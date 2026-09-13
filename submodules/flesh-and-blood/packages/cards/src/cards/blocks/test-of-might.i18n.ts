import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { testOfMight } from "./test-of-might.ts";

export const testOfMightI18n = defineFamilyI18n(testOfMight, {
  en: {
    name: "Test of Might",
    text: "When this defends, clash with the attacking hero. The winner creates a Might token.",
    typeText: "Brute / Guardian Block",
  },
});

export const { red: testOfMightRedI18n } = testOfMightI18n.cards;
