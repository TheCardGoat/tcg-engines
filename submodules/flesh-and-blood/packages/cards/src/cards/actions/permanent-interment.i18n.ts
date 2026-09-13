import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { permanentInterment } from "./permanent-interment.ts";

export const permanentIntermentI18n = defineFamilyI18n(permanentInterment, {
  en: {
    name: "Permanent Interment",
    typeText: "Shadow Action - Attack",
    text: "When this attacks, you may pay up to {r}{r}{r}. Turn that many Shadow cards in your banished zone face-down. This gets +1{p} for each card turned face-down this way.\nBlood Debt",
  },
});

export const {
  red: permanentIntermentRedI18n,
  yellow: permanentIntermentYellowI18n,
  blue: permanentIntermentBlueI18n,
} = permanentIntermentI18n.cards;
