import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ritesOfNightfall } from "./rites-of-nightfall.ts";

export const ritesOfNightfallI18n = defineFamilyI18n(ritesOfNightfall, {
  en: {
    name: "Rites of Nightfall",
    typeText: "Shadow Action",
    text: "Create a Gate to i'Arathael token.\nGo again",
  },
});

export const { blue: ritesOfNightfallBlueI18n } = ritesOfNightfallI18n.cards;
