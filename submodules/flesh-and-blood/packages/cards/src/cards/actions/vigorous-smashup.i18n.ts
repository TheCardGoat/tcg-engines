import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vigorousSmashup } from "./vigorous-smashup.ts";

export const vigorousSmashupI18n = defineFamilyI18n(vigorousSmashup, {
  en: {
    name: "Vigorous Smashup",
    text: "When this defends, clash with the attacking hero. The winner creates a Vigor token. You may put your revealed card on the bottom of its owner's deck.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: vigorousSmashupRedI18n,
  yellow: vigorousSmashupYellowI18n,
  blue: vigorousSmashupBlueI18n,
} = vigorousSmashupI18n.cards;
