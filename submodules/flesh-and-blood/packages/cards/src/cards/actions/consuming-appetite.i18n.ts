import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { consumingAppetite } from "./consuming-appetite.ts";

export const consumingAppetiteI18n = defineFamilyI18n(consumingAppetite, {
  en: {
    name: "Consuming Appetite",
    typeText: "Shadow Brute Action - Attack",
    text: 'Instant - {r}, banish this from your hand: Until end of turn, Blasmophet, the Insatiable Hunger tokens you control get "Action - {t}: Attack. Go again"\nBlood Debt',
  },
});

export const { yellow: consumingAppetiteYellowI18n } = consumingAppetiteI18n.cards;
