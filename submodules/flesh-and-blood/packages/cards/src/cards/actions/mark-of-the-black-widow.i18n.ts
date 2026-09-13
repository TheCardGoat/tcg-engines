import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { markOfTheBlackWidow } from "./mark-of-the-black-widow.ts";

export const markOfTheBlackWidowI18n = defineFamilyI18n(markOfTheBlackWidow, {
  en: {
    name: "Mark of the Black Widow",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a marked hero, they banish a card from their hand.",
  },
});

export const {
  red: markOfTheBlackWidowRedI18n,
  yellow: markOfTheBlackWidowYellowI18n,
  blue: markOfTheBlackWidowBlueI18n,
} = markOfTheBlackWidowI18n.cards;
