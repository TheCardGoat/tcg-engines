import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { abyssalBite } from "./abyssal-bite.ts";

export const abyssalBiteI18n = defineFamilyI18n(abyssalBite, {
  en: {
    name: "Abyssal Bite",
    typeText: "Shadow Action",
    text: "You may play this from your banished zone.\nYour next Shadow attack this turn gets +1{p}. Go again\nBlood Debt",
  },
});

export const { blue: abyssalBiteBlueI18n } = abyssalBiteI18n.cards;
