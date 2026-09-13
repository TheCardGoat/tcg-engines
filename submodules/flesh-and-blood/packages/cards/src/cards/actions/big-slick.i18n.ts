import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bigSlick } from "./big-slick.ts";

export const bigSlickI18n = defineFamilyI18n(bigSlick, {
  en: {
    name: "Big Slick",
    typeText: "Warrior Action",
    text: (amount) =>
      `Your next sword attack this turn gets +${amount}{p} and "When this attacks, wager with the defending hero. The winner draws a card."\nGo again`,
  },
});

export const {
  red: bigSlickRedI18n,
  yellow: bigSlickYellowI18n,
  blue: bigSlickBlueI18n,
} = bigSlickI18n.cards;
