import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ghostlyVisit } from "./ghostly-visit.ts";

export const ghostlyVisitI18n = defineFamilyI18n(ghostlyVisit, {
  en: {
    name: "Ghostly Visit",
    text: "You may play Ghostly Visit from your banished zone.\nBlood Debt",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: ghostlyVisitRedI18n,
  yellow: ghostlyVisitYellowI18n,
  blue: ghostlyVisitBlueI18n,
} = ghostlyVisitI18n.cards;
