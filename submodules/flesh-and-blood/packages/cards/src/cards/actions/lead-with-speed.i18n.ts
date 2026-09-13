import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { leadWithSpeed } from "./lead-with-speed.ts";

export const leadWithSpeedI18n = defineFamilyI18n(leadWithSpeed, {
  en: {
    name: "Lead with Speed",
    text: "Your next Brute or Warrior attack this turn gets +3{p}.\nCreate an Agility token.\nGo again",
    typeText: "Brute / Warrior Action",
  },
});

export const {
  red: leadWithSpeedRedI18n,
  yellow: leadWithSpeedYellowI18n,
  blue: leadWithSpeedBlueI18n,
} = leadWithSpeedI18n.cards;
