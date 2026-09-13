import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { harmonyOfTheHunt } from "./harmony-of-the-hunt.ts";

export const harmonyOfTheHuntI18n = defineFamilyI18n(harmonyOfTheHunt, {
  en: {
    name: "Harmony of the Hunt",
    text: "When this attacks, if you've pitched a blue card this turn, create a Crouching Tiger in your hand.\nGo again",
    typeText: "Mystic Ninja Action - Attack",
  },
});

export const {
  red: harmonyOfTheHuntRedI18n,
  yellow: harmonyOfTheHuntYellowI18n,
  blue: harmonyOfTheHuntBlueI18n,
} = harmonyOfTheHuntI18n.cards;
