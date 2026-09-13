import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { madcapCharger } from "./madcap-charger.ts";

export const madcapChargerI18n = defineFamilyI18n(madcapCharger, {
  en: {
    name: "Madcap Charger",
    text: "As an additional cost to play Madcap Charger, discard a random card.\nIf the discarded card has 6 or more {p}, Madcap Charger has go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: madcapChargerRedI18n,
  yellow: madcapChargerYellowI18n,
  blue: madcapChargerBlueI18n,
} = madcapChargerI18n.cards;
