import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sweepingBlow } from "./sweeping-blow.ts";

export const sweepingBlowI18n = defineFamilyI18n(sweepingBlow, {
  en: {
    name: "Sweeping Blow",
    typeText: "Draconic Illusionist Action - Attack",
    text: "When you attack with Sweeping Blow, create an Ash token.\nGo again",
  },
});

export const {
  red: sweepingBlowRedI18n,
  yellow: sweepingBlowYellowI18n,
  blue: sweepingBlowBlueI18n,
} = sweepingBlowI18n.cards;
