import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { risingPower } from "./rising-power.ts";

export const risingPowerI18n = defineFamilyI18n(risingPower, {
  en: {
    name: "Rising Power",
    text: "If you've drawn a card this turn, this gets +1{p}.",
    typeText: "Brute / Guardian Action - Attack",
  },
});

export const {
  red: risingPowerRedI18n,
  yellow: risingPowerYellowI18n,
  blue: risingPowerBlueI18n,
} = risingPowerI18n.cards;
