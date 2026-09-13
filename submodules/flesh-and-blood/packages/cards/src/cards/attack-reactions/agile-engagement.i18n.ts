import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { agileEngagement } from "./agile-engagement.ts";

export const agileEngagementI18n = defineFamilyI18n(agileEngagement, {
  en: {
    name: "Agile Engagement",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target Warrior attack gets +${amount}{p}. If it's defended by an attack action card, create an Agility token.`,
  },
});
export const {
  red: agileEngagementRedI18n,
  yellow: agileEngagementYellowI18n,
  blue: agileEngagementBlueI18n,
} = agileEngagementI18n.cards;
