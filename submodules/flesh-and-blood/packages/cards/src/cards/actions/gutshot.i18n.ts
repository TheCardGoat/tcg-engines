import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gutshot } from "./gutshot.ts";

export const gutshotI18n = defineFamilyI18n(gutshot, {
  en: {
    name: "Gutshot",
    typeText: "Warrior Action",
    text: (amount) =>
      `Your next sword attack this turn gets +${amount}{p} and "When this attacks, wager with the defending hero. The winner creates a Blade Dance token."\nGo again`,
  },
});

export const {
  red: gutshotRedI18n,
  yellow: gutshotYellowI18n,
  blue: gutshotBlueI18n,
} = gutshotI18n.cards;
