import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fertileGround } from "./fertile-ground.ts";

export const fertileGroundI18n = defineFamilyI18n(fertileGround, {
  en: {
    name: "Fertile Ground",
    typeText: "Earth Instant",
    text: ({ thresholdGain }) =>
      `Gain 2{h}\nIf there are 4 or more Earth cards in your banished zone, instead gain ${thresholdGain}{h}.`,
  },
});

export const {
  red: fertileGroundRedI18n,
  yellow: fertileGroundYellowI18n,
  blue: fertileGroundBlueI18n,
} = fertileGroundI18n.cards;
