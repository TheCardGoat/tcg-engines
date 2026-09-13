import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { breakneckBattery } from "./breakneck-battery.ts";

export const breakneckBatteryI18n = defineFamilyI18n(breakneckBattery, {
  en: {
    name: "Breakneck Battery",
    text: "As an additional cost to play Breakneck Battery, discard a random card.\nIf the discarded card has 6 or more {p}, Breakneck Battery gains go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: breakneckBatteryRedI18n,
  yellow: breakneckBatteryYellowI18n,
  blue: breakneckBatteryBlueI18n,
} = breakneckBatteryI18n.cards;
