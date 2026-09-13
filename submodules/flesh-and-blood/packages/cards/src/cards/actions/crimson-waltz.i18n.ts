import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crimsonWaltz } from "./crimson-waltz.ts";

export const crimsonWaltzI18n = defineFamilyI18n(crimsonWaltz, {
  en: {
    name: "Crimson Waltz",
    typeText: "Warrior Action",
    text: "Your next sword attack this turn gets +4{p}.\nThe next time you attack with a sword this turn, draw a card, then put a card from your hand on top of your deck.\nGo again",
  },
});

export const { yellow: crimsonWaltzYellowI18n } = crimsonWaltzI18n.cards;
