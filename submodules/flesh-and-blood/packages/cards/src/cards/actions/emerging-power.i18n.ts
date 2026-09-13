import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { emergingPower } from "./emerging-power.ts";

export const emergingPowerI18n = defineFamilyI18n(emergingPower, {
  en: {
    name: "Emerging Power",
    text: (amount) => `Go again
At the beginning of your action phase, destroy this, then the next Guardian attack action card you play this turn gets +${amount}{p}.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: emergingPowerRedI18n,
  yellow: emergingPowerYellowI18n,
  blue: emergingPowerBlueI18n,
} = emergingPowerI18n.cards;
