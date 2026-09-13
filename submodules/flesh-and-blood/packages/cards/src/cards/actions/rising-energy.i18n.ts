import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { risingEnergy } from "./rising-energy.ts";

export const risingEnergyI18n = defineFamilyI18n(risingEnergy, {
  en: {
    name: "Rising Energy",
    text: "If you've drawn a card this turn, this costs {r} less to play.",
    typeText: "Guardian / Warrior Action - Attack",
  },
});

export const {
  red: risingEnergyRedI18n,
  yellow: risingEnergyYellowI18n,
  blue: risingEnergyBlueI18n,
} = risingEnergyI18n.cards;
