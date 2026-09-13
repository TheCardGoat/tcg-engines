import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { highRoller } from "./high-roller.ts";

export const highRollerI18n = defineFamilyI18n(highRoller, {
  en: {
    name: "High Roller",
    text: "Intimidate\nIf you have rolled a 4, 5, or 6 on a die this turn, instead intimidate twice.\nGo again",
    typeText: "Brute Action",
  },
});

export const {
  red: highRollerRedI18n,
  yellow: highRollerYellowI18n,
  blue: highRollerBlueI18n,
} = highRollerI18n.cards;
