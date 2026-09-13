import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tapLessonsPast } from "./tap-lessons-past.ts";

export const tapLessonsPastI18n = defineFamilyI18n(tapLessonsPast, {
  en: {
    name: "Tap Lessons Past",
    text: (_parameter, color) =>
      `Deal ${color === "red" ? 4 : color === "yellow" ? 2 : 3} arcane damage to any target.\nIf this deals damage, you may {t} your hero. If you do, put an instant card from your graveyard on the bottom of your deck.`,
    typeText: "Lightning Wizard Action",
  },
});

export const {
  red: tapLessonsPastRedI18n,
  yellow: tapLessonsPastYellowI18n,
  blue: tapLessonsPastBlueI18n,
} = tapLessonsPastI18n.cards;
