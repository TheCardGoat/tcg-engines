import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { performanceBonus } from "./performance-bonus.ts";

export const performanceBonusI18n = defineFamilyI18n(performanceBonus, {
  en: {
    name: "Performance Bonus",
    text: "When this hits, create a Gold token.\nIf this was played from arsenal, it gets Go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: performanceBonusRedI18n,
  yellow: performanceBonusYellowI18n,
  blue: performanceBonusBlueI18n,
} = performanceBonusI18n.cards;
