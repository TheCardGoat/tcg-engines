import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { testOfIronGrip } from "./test-of-iron-grip.ts";

export const testOfIronGripI18n = defineFamilyI18n(testOfIronGrip, {
  en: {
    name: "Test of Iron Grip",
    text: "When this defends, clash with the attacking hero. If there is a winner, the other hero discards a card.",
    typeText: "Guardian Block",
  },
});

export const { red: testOfIronGripRedI18n } = testOfIronGripI18n.cards;
