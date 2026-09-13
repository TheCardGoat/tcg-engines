import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { thunderousRetort } from "./thunderous-retort.ts";

export const thunderousRetortI18n = defineFamilyI18n(thunderousRetort, {
  en: {
    name: "Thunderous Retort",
    typeText: "Lightning Instant - Aura",
    text: (barrier) =>
      `At the beginning of your action phase, destroy this, then your next attack this turn gets go again.\nArcane Barrier ${barrier}`,
  },
});

export const {
  red: thunderousRetortRedI18n,
  yellow: thunderousRetortYellowI18n,
  blue: thunderousRetortBlueI18n,
} = thunderousRetortI18n.cards;
