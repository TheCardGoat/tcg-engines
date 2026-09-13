import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { emergingDominance } from "./emerging-dominance.ts";

export const emergingDominanceI18n = defineFamilyI18n(emergingDominance, {
  en: {
    name: "Emerging Dominance",
    text: (amount) =>
      `At the beginning of your action phase, destroy Emerging Dominance then the next Guardian attack action card you play this turn gains +${amount}{p} and dominate.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: emergingDominanceRedI18n,
  yellow: emergingDominanceYellowI18n,
  blue: emergingDominanceBlueI18n,
} = emergingDominanceI18n.cards;
