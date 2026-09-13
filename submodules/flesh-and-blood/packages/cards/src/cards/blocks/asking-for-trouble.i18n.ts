import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { askingForTrouble } from "./asking-for-trouble.ts";

export const askingForTroubleI18n = defineFamilyI18n(askingForTrouble, {
  en: {
    name: "Asking for Trouble",
    text: "When this defends, create a Vigor token under the attacking hero's control.",
    typeText: "Brute Block",
  },
});

export const { yellow: askingForTroubleYellowI18n } = askingForTroubleI18n.cards;
