import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { companionOfTheClaw } from "./companion-of-the-claw.ts";

export const companionOfTheClawI18n = defineFamilyI18n(companionOfTheClaw, {
  en: {
    name: "Companion of the Claw",
    text: "When this attacks, if you've pitched a blue card this turn, create a Crouching Tiger in your hand.\nGo again",
    typeText: "Mystic Ninja Action - Attack",
  },
});

export const {
  red: companionOfTheClawRedI18n,
  yellow: companionOfTheClawYellowI18n,
  blue: companionOfTheClawBlueI18n,
} = companionOfTheClawI18n.cards;
