import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flyingHigh } from "./flying-high.ts";

export const flyingHighI18n = defineFamilyI18n(flyingHigh, {
  en: {
    name: "Flying High",
    typeText: "Generic Action",
    text: ({ color }) =>
      `Your next attack this turn gets go again. If it's ${color}, it gets +1{p}.\nGo again`,
  },
});

export const {
  red: flyingHighRedI18n,
  yellow: flyingHighYellowI18n,
  blue: flyingHighBlueI18n,
} = flyingHighI18n.cards;
