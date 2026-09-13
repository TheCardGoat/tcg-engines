import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { calmveilOfVolthaven } from "./calmveil-of-volthaven.ts";

export const calmveilOfVolthavenI18n = defineFamilyI18n(calmveilOfVolthaven, {
  en: {
    name: "Calmveil of Volthaven",
    typeText: "Lightning Instant",
    text: (amount) =>
      `Prevent the next ${amount} damage that would be dealt to you this turn. The first time you prevent damage this way, create a Lightning Flow token.`,
  },
});

export const {
  red: calmveilOfVolthavenRedI18n,
  yellow: calmveilOfVolthavenYellowI18n,
  blue: calmveilOfVolthavenBlueI18n,
} = calmveilOfVolthavenI18n.cards;
