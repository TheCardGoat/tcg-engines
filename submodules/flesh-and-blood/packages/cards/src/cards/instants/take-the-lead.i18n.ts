import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { takeTheLead } from "./take-the-lead.ts";

export const takeTheLeadI18n = defineFamilyI18n(takeTheLead, {
  en: {
    name: "Take the Lead",
    typeText: "Warrior Instant",
    text: "The next time you would be dealt damage this turn, prevent 2 of that damage. If you prevent damage this way, create a Blade Dance token.",
  },
});

export const { red: takeTheLeadRedI18n } = takeTheLeadI18n.cards;
