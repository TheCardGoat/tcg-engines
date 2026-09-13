import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stonewallConfidence } from "./stonewall-confidence.ts";

export const stonewallConfidenceI18n = defineFamilyI18n(stonewallConfidence, {
  en: {
    name: "Stonewall Confidence",
    text: (amount) => `Go again
Cards you control with cost 3 or more get +${amount}{d} while defending.
At the beginning of your action phase, destroy this.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: stonewallConfidenceRedI18n,
  yellow: stonewallConfidenceYellowI18n,
  blue: stonewallConfidenceBlueI18n,
} = stonewallConfidenceI18n.cards;
