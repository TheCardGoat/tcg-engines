import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fastingCarcass } from "./fasting-carcass.ts";

export const fastingCarcassI18n = defineFamilyI18n(fastingCarcass, {
  en: {
    name: "Fasting Carcass",
    text: ({ color }) => `The next ${color} action card you play this turn gets go again.
Go again
Blood Debt`,
    typeText: "Shadow Action",
  },
});

export const {
  red: fastingCarcassRedI18n,
  yellow: fastingCarcassYellowI18n,
  blue: fastingCarcassBlueI18n,
} = fastingCarcassI18n.cards;
