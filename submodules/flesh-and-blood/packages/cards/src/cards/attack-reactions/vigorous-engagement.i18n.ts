import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { vigorousEngagement } from "./vigorous-engagement.ts";

export const vigorousEngagementI18n = defineFamilyI18n(vigorousEngagement, {
  en: {
    name: "Vigorous Engagement",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target Warrior attack gets +${amount}{p}. If it's defended by an attack action card, create a Vigor token.`,
  },
});
export const {
  red: vigorousEngagementRedI18n,
  yellow: vigorousEngagementYellowI18n,
  blue: vigorousEngagementBlueI18n,
} = vigorousEngagementI18n.cards;
