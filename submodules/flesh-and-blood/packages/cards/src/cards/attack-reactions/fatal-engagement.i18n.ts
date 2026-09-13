import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fatalEngagement } from "./fatal-engagement.ts";

export const fatalEngagementI18n = defineFamilyI18n(fatalEngagement, {
  en: {
    name: "Fatal Engagement",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Play this only if an attack action card is defending this chain link.\nTarget attack gets +${amount}{p}.`,
  },
});
export const {
  red: fatalEngagementRedI18n,
  yellow: fatalEngagementYellowI18n,
  blue: fatalEngagementBlueI18n,
} = fatalEngagementI18n.cards;
