import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chromaticRefinement } from "./chromatic-refinement.ts";

export const chromaticRefinementI18n = defineFamilyI18n(chromaticRefinement, {
  en: {
    name: "Chromatic Refinement",
    typeText: "Lightning Instant - Aura",
    text: ({ color }) =>
      `At the beginning of your action phase, destroy this, then the next ${color} card you play this turn costs {r} less to play. The first time that card would deal damage this turn, instead it deals that much plus 1.`,
  },
});

export const {
  red: chromaticRefinementRedI18n,
  yellow: chromaticRefinementYellowI18n,
  blue: chromaticRefinementBlueI18n,
} = chromaticRefinementI18n.cards;
