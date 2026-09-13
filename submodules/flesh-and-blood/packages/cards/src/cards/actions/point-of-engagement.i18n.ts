import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pointOfEngagement } from "./point-of-engagement.ts";

export const pointOfEngagementI18n = defineFamilyI18n(pointOfEngagement, {
  en: {
    name: "Point of Engagement",
    text: ({ value1 }) => `Your next dagger attack this turn gets +${value1}{p}.
Until end of turn, your attacks get +1{p} while attacking a marked hero.
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: pointOfEngagementRedI18n,
  yellow: pointOfEngagementYellowI18n,
  blue: pointOfEngagementBlueI18n,
} = pointOfEngagementI18n.cards;
