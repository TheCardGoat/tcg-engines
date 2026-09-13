import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { prowl } from "./prowl.ts";

export const prowlI18n = defineFamilyI18n(prowl, {
  en: {
    name: "Prowl",
    text: "Stealth\nThe next attack with stealth you play this combat chain gains +1{p}.",
    typeText: "Assassin Action - Attack",
  },
});
export const { red: prowlRedI18n, yellow: prowlYellowI18n, blue: prowlBlueI18n } = prowlI18n.cards;
