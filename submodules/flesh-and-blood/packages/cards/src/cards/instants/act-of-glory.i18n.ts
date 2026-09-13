import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { actOfGlory } from "./act-of-glory.ts";

export const actOfGloryI18n = defineFamilyI18n(actOfGlory, {
  en: {
    name: "Act of Glory",
    typeText: "Guardian Instant - Aura",
    text: (amount) =>
      `Suspense\nWhen this leaves the arena, your next attack this turn gets +${amount}{p}.`,
  },
});

export const {
  red: actOfGloryRedI18n,
  yellow: actOfGloryYellowI18n,
  blue: actOfGloryBlueI18n,
} = actOfGloryI18n.cards;
