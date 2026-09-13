import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { risingSpeed } from "./rising-speed.ts";

export const risingSpeedI18n = defineFamilyI18n(risingSpeed, {
  en: {
    name: "Rising Speed",
    text: "If you've drawn a card this turn, this gets go again.",
    typeText: "Brute / Warrior Action - Attack",
  },
});
export const {
  red: risingSpeedRedI18n,
  yellow: risingSpeedYellowI18n,
  blue: risingSpeedBlueI18n,
} = risingSpeedI18n.cards;
