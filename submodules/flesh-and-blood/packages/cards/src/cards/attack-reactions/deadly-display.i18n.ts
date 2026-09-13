import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deadlyDisplay } from "./deadly-display.ts";

export const deadlyDisplayI18n = defineFamilyI18n(deadlyDisplay, {
  en: {
    name: "Deadly Display",
    typeText: "Warrior Attack Reaction",
    text: (amount) => {
      return `Target weapon attack gets +${amount}{p}. If the weapon has been sharpened this turn, the attack gets "When this hits a hero, create a Flurry token."`;
    },
  },
});

export const {
  red: deadlyDisplayRedI18n,
  yellow: deadlyDisplayYellowI18n,
  blue: deadlyDisplayBlueI18n,
} = deadlyDisplayI18n.cards;
