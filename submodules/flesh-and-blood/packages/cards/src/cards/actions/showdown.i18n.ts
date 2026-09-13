import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { showdown } from "./showdown.ts";

export const showdownI18n = defineFamilyI18n(showdown, {
  en: {
    name: "Showdown",
    typeText: "Warrior Action",
    text: (amount) =>
      `Your next sword attack this turn gets +${amount}{p} and "When this attacks, wager with the defending hero. The winner creates a Flurry token."\nGo again`,
  },
});

export const {
  red: showdownRedI18n,
  yellow: showdownYellowI18n,
  blue: showdownBlueI18n,
} = showdownI18n.cards;
