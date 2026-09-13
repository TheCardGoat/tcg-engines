import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { peakPower } from "./peak-power.ts";

export const peakPowerI18n = defineFamilyI18n(peakPower, {
  en: {
    name: "Peak Power",
    typeText: "Brute Action - Attack",
    text: "When this attacks, reveal the top card of your deck. If the revealed card has 6 or more base {p}, this gets overpower.",
  },
});

export const {
  red: peakPowerRedI18n,
  yellow: peakPowerYellowI18n,
  blue: peakPowerBlueI18n,
} = peakPowerI18n.cards;
