import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { corporealChasm } from "./corporeal-chasm.ts";

export const corporealChasmI18n = defineFamilyI18n(corporealChasm, {
  en: {
    name: "Corporeal Chasm",
    typeText: "Shadow Action - Attack",
    text: "When this hits, create a Gate to i'Arathael token\nBlood Debt\"",
  },
});

export const {
  red: corporealChasmRedI18n,
  yellow: corporealChasmYellowI18n,
  blue: corporealChasmBlueI18n,
} = corporealChasmI18n.cards;
