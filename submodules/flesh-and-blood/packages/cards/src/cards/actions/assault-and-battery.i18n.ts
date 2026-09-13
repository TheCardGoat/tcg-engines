import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { assaultAndBattery } from "./assault-and-battery.ts";

export const assaultAndBatteryI18n = defineFamilyI18n(assaultAndBattery, {
  en: {
    name: "Assault and Battery",
    text: "Beat Chest\nWhen this attacks, if you've beaten chest this turn, create an Agility token.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: assaultAndBatteryRedI18n,
  yellow: assaultAndBatteryYellowI18n,
  blue: assaultAndBatteryBlueI18n,
} = assaultAndBatteryI18n.cards;
