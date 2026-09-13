import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { abyssalForce } from "./abyssal-force.ts";

export const abyssalForceI18n = defineFamilyI18n(abyssalForce, {
  en: {
    name: "Abyssal Force",
    typeText: "Shadow Action",
    text: "You may play this from your banished zone.\nYour next Shadow attack this turn gets overpower.\nGo again\nBlood Debt",
  },
});

export const { blue: abyssalForceBlueI18n } = abyssalForceI18n.cards;
