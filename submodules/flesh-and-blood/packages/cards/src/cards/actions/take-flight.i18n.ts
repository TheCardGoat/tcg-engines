import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { takeFlight } from "./take-flight.ts";

export const takeFlightI18n = defineFamilyI18n(takeFlight, {
  en: {
    name: "Take Flight",
    typeText: "Light Warrior Action - Attack",
    text: "As an additional cost to play Take Flight, you may charge your hero's soul.\nIf you've charged this turn, Take Flight gains go again.",
  },
});

export const {
  red: takeFlightRedI18n,
  yellow: takeFlightYellowI18n,
  blue: takeFlightBlueI18n,
} = takeFlightI18n.cards;
