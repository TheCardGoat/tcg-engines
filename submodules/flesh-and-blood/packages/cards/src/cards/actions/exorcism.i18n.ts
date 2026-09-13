import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { exorcism } from "./exorcism.ts";
export const exorcismI18n = defineFamilyI18n(exorcism, {
  en: {
    name: "Exorcism",
    typeText: "Generic Action",
    text: 'Your next attack this turn gets +3{p} and "When this hits a hero, turn all cards in their banished zone face-down."\nGo again',
  },
});
export const { red: exorcismRedI18n } = exorcismI18n.cards;
