import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { saltwaterSwell } from "./saltwater-swell.ts";

export const saltwaterSwellI18n = defineFamilyI18n(saltwaterSwell, {
  en: {
    name: "Saltwater Swell",
    text: "When this attacks, reveal the top card of your deck. If it's blue, pitch it.\nGo again",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: saltwaterSwellRedI18n,
  yellow: saltwaterSwellYellowI18n,
  blue: saltwaterSwellBlueI18n,
} = saltwaterSwellI18n.cards;
