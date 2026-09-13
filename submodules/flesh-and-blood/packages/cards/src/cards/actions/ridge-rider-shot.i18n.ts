import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ridgeRiderShot } from "./ridge-rider-shot.ts";

export const ridgeRiderShotI18n = defineFamilyI18n(ridgeRiderShot, {
  en: {
    name: "Ridge Rider Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Ridge Rider Shot is put into your arsenal face up, opt 1.",
  },
});

export const {
  red: ridgeRiderShotRedI18n,
  yellow: ridgeRiderShotYellowI18n,
  blue: ridgeRiderShotBlueI18n,
} = ridgeRiderShotI18n.cards;
