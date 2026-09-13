import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { abyssalRush } from "./abyssal-rush.ts";

export const abyssalRushI18n = defineFamilyI18n(abyssalRush, {
  en: {
    name: "Abyssal Rush",
    typeText: "Shadow Action",
    text: 'You may play this from your banished zone.\nYour next Shadow attack this turn gets "When this hits, it gets go again." Go again\nBlood Debt',
  },
});

export const { blue: abyssalRushBlueI18n } = abyssalRushI18n.cards;
