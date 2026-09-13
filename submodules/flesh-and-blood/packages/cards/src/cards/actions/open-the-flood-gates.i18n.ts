import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { openTheFloodGates } from "./open-the-flood-gates.ts";

export const openTheFloodGatesI18n = defineFamilyI18n(openTheFloodGates, {
  en: {
    name: "Open the Flood Gates",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage, draw 2 cards.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: openTheFloodGatesRedI18n,
  yellow: openTheFloodGatesYellowI18n,
  blue: openTheFloodGatesBlueI18n,
} = openTheFloodGatesI18n.cards;
