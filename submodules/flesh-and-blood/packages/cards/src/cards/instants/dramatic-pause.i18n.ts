import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dramaticPause } from "./dramatic-pause.ts";

export const dramaticPauseI18n = defineFamilyI18n(dramaticPause, {
  en: {
    name: "Dramatic Pause",
    typeText: "Guardian Instant - Aura",
    text: (amount) =>
      `Suspense\nWhen this enters the arena, target defending action card gets +${amount}{d} this chain link.`,
  },
});

export const {
  red: dramaticPauseRedI18n,
  yellow: dramaticPauseYellowI18n,
  blue: dramaticPauseBlueI18n,
} = dramaticPauseI18n.cards;
