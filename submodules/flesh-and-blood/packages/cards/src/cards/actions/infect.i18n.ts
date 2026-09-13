import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { infect } from "./infect.ts";

export const infectI18n = defineFamilyI18n(infect, {
  en: {
    name: "Infect",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a hero, create a Bloodrot Pox token under their control.",
  },
});

export const {
  red: infectRedI18n,
  yellow: infectYellowI18n,
  blue: infectBlueI18n,
} = infectI18n.cards;
