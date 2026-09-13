import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rushOfPower } from "./rush-of-power.ts";

export const rushOfPowerI18n = defineFamilyI18n(rushOfPower, {
  en: {
    name: "Rush of Power",
    text: "Quickstrike - If this has go again, it gets +1{p}.\nWhen this hits a hero, deal 1 arcane damage to them.",
    typeText: "Lightning Runeblade Action - Attack",
  },
});

export const {
  red: rushOfPowerRedI18n,
  yellow: rushOfPowerYellowI18n,
  blue: rushOfPowerBlueI18n,
} = rushOfPowerI18n.cards;
