import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lessonsLearned } from "./lessons-learned.ts";

export const lessonsLearnedI18n = defineFamilyI18n(lessonsLearned, {
  en: {
    name: "Lessons Learned",
    typeText: "Warrior Instant",
    text: "Shuffle up to 3 attack reaction cards with different names from your graveyard into your deck.",
  },
});

export const { blue: lessonsLearnedBlueI18n } = lessonsLearnedI18n.cards;
