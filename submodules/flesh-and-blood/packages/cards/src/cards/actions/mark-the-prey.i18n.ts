import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { markThePrey } from "./mark-the-prey.ts";

export const markThePreyI18n = defineFamilyI18n(markThePrey, {
  en: {
    name: "Mark the Prey",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a hero, mark them.",
  },
});

export const {
  red: markThePreyRedI18n,
  yellow: markThePreyYellowI18n,
  blue: markThePreyBlueI18n,
} = markThePreyI18n.cards;
