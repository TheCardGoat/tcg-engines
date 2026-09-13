import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { predatoryStreak } from "./predatory-streak.ts";

export const predatoryStreakI18n = defineFamilyI18n(predatoryStreak, {
  en: {
    name: "Predatory Streak",
    text: ({ count }) =>
      `Create ${count} Crouching Tigers in your banished zone. You may play them this turn.`,
    typeText: "Ninja Action",
  },
});

export const {
  red: predatoryStreakRedI18n,
  yellow: predatoryStreakYellowI18n,
  blue: predatoryStreakBlueI18n,
} = predatoryStreakI18n.cards;
