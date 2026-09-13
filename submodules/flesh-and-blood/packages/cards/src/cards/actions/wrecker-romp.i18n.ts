import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wreckerRomp } from "./wrecker-romp.ts";

export const wreckerRompI18n = defineFamilyI18n(wreckerRomp, {
  en: {
    name: "Wrecker Romp",
    text: "As an additional cost to play this, discard a random card.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: wreckerRompRedI18n,
  yellow: wreckerRompYellowI18n,
  blue: wreckerRompBlueI18n,
} = wreckerRompI18n.cards;
