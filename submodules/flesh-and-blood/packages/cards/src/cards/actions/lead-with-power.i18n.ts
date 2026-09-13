import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { leadWithPower } from "./lead-with-power.ts";

export const leadWithPowerI18n = defineFamilyI18n(leadWithPower, {
  en: {
    name: "Lead with Power",
    text: "Your next Brute or Guardian attack this turn gets +3{p}.\nCreate a Might token.\nGo again",
    typeText: "Brute / Guardian Action",
  },
});

export const {
  red: leadWithPowerRedI18n,
  yellow: leadWithPowerYellowI18n,
  blue: leadWithPowerBlueI18n,
} = leadWithPowerI18n.cards;
